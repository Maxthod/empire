import { Application } from "express"
import { cache } from "./cache"
import { dataLoader } from "./datasource"
import { City, Empire } from "./model"

export const findEmpiresOfCities = async (cities: string[]) => {
    const empiresPromises =
        cities.map(city =>
            cache
                .findByCityName(city)
                .catch(err => {
                    console.error(`Failed to retrieve empire of city ${city}`, err)
                }))
    return (await Promise.all(empiresPromises))
        .filter(empire => empire) as Array<Empire>
}

export const findHighestPopulationEmpire = (empires: Array<Empire>) => {
    return empires
        .filter(empire => empire)
        .reduce<Empire | undefined>((acc, curr) => {
            if (acc && acc.total_population > curr.total_population) {
                return acc
            } else {
                return curr
            }
        }, undefined)
}

export const findAllEmpires = async () => {
    return await cache.findAllEmpires()
}

export const findLowestDensityCity: () => Promise<City | undefined> = async () => {
    const cities = await cache.findAllCities()
    return cities.reduce<City | undefined>((acc, curr) => {
        if (acc && acc.density < curr.density) {
            return acc
        } else {
            return curr
        }
    }, undefined)
}

export const init = async (app: Application) => {
    if (!app.locals['ready']) {
        const empireStream = await dataLoader.load()
        for await (const empire of empireStream) {
            cache.set(empire)
        }
        app.locals['ready'] = true
    }
}