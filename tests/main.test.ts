import { exportSpecifier } from '@babel/types';
import exp from 'constants';
import { Application } from 'express';
import { findAllEmpires } from '../src/main';
import { City } from '../src/model';

type MockEmpire = {
    name: string
    empire_id: number
}

describe('Main', () => {
    beforeEach(async () => {
        jest.resetModules()
        const { init } = await import('../src/main')
        const mockApp = {
            locals: {}
        } as Application
        await init(mockApp)
    });

    it("will return the lowest density city", async () => {
        // Arrange
        const { findLowestDensityCity } = await import('../src/main')

        // Act
        const lowestDensityCity = await findLowestDensityCity()

        // Assert
        expect(lowestDensityCity).toBeDefined()
        expect((lowestDensityCity as City).name).toEqual("Teztoco")
    })

    it("will return the all the empires and their cities", async () => {
        // Arrange
        const { findAllEmpires } = await import('../src/main')

        // Act
        const empires = await findAllEmpires()

        // Assert
        expect(empires.length).toEqual(4)
        const numberCities = empires.reduce((acc, curr) => acc + curr.cities.length, 0)
        expect(numberCities).toEqual(8)
    })

    it("will return the highest population empire", async () => {
        // Arrange
        const { findAllEmpires, findHighestPopulationEmpire } = await import('../src/main')

        // Act
        const empires = await findAllEmpires()
        const highestPopulationEmpire = await findHighestPopulationEmpire(empires)

        // Assert
        expect(highestPopulationEmpire).toBeDefined()
        expect(highestPopulationEmpire?.name).toEqual("Greek")
    })

    it("will return list of empire of each city given a list of cities", async () => {
        // Arrange
        const { findEmpiresOfCities } = await import('../src/main')
        const cities: Array<string> = ["Athens", "Sparta", "Cusco"]

        // Act
        const empires = await findEmpiresOfCities(cities)

        // Assert
        expect(empires.length).toEqual(3)
    })

})
