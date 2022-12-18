import { Empire } from "./model"

export interface Cache {
    set: (empire: Empire) => Promise<void>
    get: (name: string) => Promise<Empire | undefined>
}

const InMemoryCacheConstructor: () => Cache = () => {
    const cacheMap = new Map<string, Empire>()
    return {
        set: async (empire) => {
            cacheMap.set(empire.name, empire)
        },
        get: async (name) => {
            return cacheMap.get(name)
        }
    }
}
export const cache: Cache = InMemoryCacheConstructor()