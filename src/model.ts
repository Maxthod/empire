export type City = {
    name: string
    population: number
    area: number
    density: number
}

export type Empire = {
    name: string
    total_population: number
    highest_density_city?: City
    cities: Array<City>
}