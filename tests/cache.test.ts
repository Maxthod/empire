import { Empire } from '../src/model';

describe('Empire Cache', () => {
    beforeEach(() => {
        jest.resetModules()
    });

    it("will return undefined on get(string) when empire does not exist", async () => {
        // Arrange
        const { cache } = await import('../src/cache')

        // Act
        const empire = await cache.get('anyname')

        // Assert
        expect(empire).toBeUndefined()
    })

    it("will accept new empire and it will return it when get(empire.name)", async () => {
        // Arrange
        const { cache } = await import('../src/cache')
        const mockEmpire: Empire = {
            name: "Estrie",
            total_population: 200,
            cities: [
                {
                    name: "Sherbrooke",
                    population: 150,
                    area: 200
                },
                {
                    name: "Magog",
                    population: 50,
                    area: 25
                }
            ]
        }

        // Act
        await cache.set(mockEmpire)

        // Assert
        const returnedEmpire = await cache.get(mockEmpire.name)
        expect(returnedEmpire).toEqual(mockEmpire)
    })

    it("will return undefined when cache is not empty when get empire that does not exist", async () => {
        // Arrange
        const { cache } = await import('../src/cache')
        const mockEmpire: Empire = {
            name: "Estrie",
            total_population: 200,
            cities: [
                {
                    name: "Sherbrooke",
                    population: 150,
                    area: 200
                },
                {
                    name: "Magog",
                    population: 50,
                    area: 25
                }
            ]
        }

        // Act
        await cache.set(mockEmpire)

        // Assert
        const returnedEmpire = await cache.get("otherempirename")
        expect(returnedEmpire).toBeUndefined()
    })

})