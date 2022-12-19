import path from 'path';
import { generator_fn, streamCsvLineByLine as streamCsvLines } from "./csv";
import { City, Empire } from "./model";

export interface DataLoader<T> {
    /**
     * Load from a source and create a iterable of T
     * @returns Iteratable of T
     */
    load: () => AsyncIterable<T>
}

export type EmpireEntry = {
    name: string
    empire_id: number
}

export type CityEntry = {
    name: string
    empire_id: number
    population: number
    area: number
}

const constructEmpire: generator_fn<EmpireEntry> = (entry) => {
    return {
        name: entry['name'],
        empire_id: Number(entry['empire_id'])
    }
}

const constructCity: generator_fn<CityEntry> = (entry) => {
    return {
        name: entry['name'],
        empire_id: Number(entry['empire_id']),
        population: Number(entry['population']),
        area: Number(entry['area'])
    }
}

const determineHighestPopulationCity = (empire: Empire, new_city: City) => {
    if (empire.highest_density_city && empire.highest_density_city.density > new_city.density) {
        return empire.highest_density_city
    } else {
        return new_city
    }
}

/**
 * We make the asumption that the cities.csv and empires.csv rows 
 * are sorted by empire_id. With this asumption, 
 * we can stream the empires without loading the whole csv in memory 
 * or sorting the csv beforehand.
 * @returns A DataLoader of empires from csv.  
 */
const CsvDataLoader: () => DataLoader<Empire> = () => {
    return {
        load: async function* () {
            const empires = await streamCsvLines(path.resolve(__dirname, 'assets', 'empires.csv'), constructEmpire)
            const cities = await streamCsvLines(path.resolve(__dirname, 'assets', 'cities.csv'), constructCity)
            let cityEntry: CityEntry | void = undefined
            for await (const empireEntry of empires) {
                const empire: Empire = {
                    name: empireEntry.name,
                    total_population: 0,
                    cities: []
                }
                if (!cityEntry) {
                    cityEntry = (await cities.next()).value
                }
                while (cityEntry && cityEntry.empire_id == empireEntry.empire_id) {
                    const city: City = {
                        name: cityEntry.name,
                        population: cityEntry.population,
                        area: cityEntry.area,
                        density: cityEntry.population / cityEntry.area
                    }

                    empire.cities.push(city)
                    empire.total_population += city.population
                    empire.highest_density_city = determineHighestPopulationCity(empire, city)
                    cityEntry = (await cities.next()).value
                }
                yield empire
            }
        }
    }
}
export const dataLoader = CsvDataLoader()