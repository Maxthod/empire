import { City, Empire } from "./model"

export interface Cache {
    set: (empire: Empire) => Promise<void>
    findAllEmpires: () => Promise<Array<Empire>>
    findAllCities: () => Promise<Array<City>>
    findByEmpireName: (name: string) => Promise<Empire | undefined>
    findByCityName: (name: string) => Promise<Empire | undefined>
}

const InMemoryCacheConstructor: () => Cache = () => {
    const empireMap = new Map<string, Empire>()
    const cityMap = new Map<string, Empire>()
    const empires: Array<Empire> = []
    const cities: Array<City> = []
    return {
        set: async (empire) => {
            empires.push(empire)
            empireMap.set(empire.name, empire)
            for (const city of empire.cities) {
                cities.push(city)
                cityMap.set(city.name, empire)
            }
        },
        findAllEmpires: async () => {
            return empires
        },
        findAllCities: async () => {
            return cities
        },
        findByEmpireName: async (name) => {
            return empireMap.get(name)
        },
        findByCityName: async (name) => {
            return cityMap.get(name)
        }
    }
}
export const cache: Cache = InMemoryCacheConstructor()