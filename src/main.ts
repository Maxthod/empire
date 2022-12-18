import { cache } from "./cache"
import { dataLoader } from "./datasource"


export default async (cities: Array<string>) => {
    const empireStream = await dataLoader.load()
    for await(const empire of empireStream) {
        cache.set(empire)


    }



}

// let highes
// const cities: City[] = await readCities()
// const empires: Empire[] = await readEmpires()
// const empiresMap: EmpiresMap = mapToEmpireObject(cities, empires)
// const empireWithHighestPopulation = findHighestPopulationEmpire(empiresMap)
// empiresMap.reduce