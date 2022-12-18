import { City, Empire, EmpiresMap } from '../src/main';

describe.skip('Modle API', () => {
    beforeEach(() => {
        jest.resetModules()
    });


    it("Given cities.csv, readCities will return a array of City", async () => {
        const { readCities } = await import('../src/main');
        // Arrange

        // Act
        const cities: City[] = await readCities()

        // Assert
        expect(cities.length).toEqual(8);
    })

    it("Given empires.csv, readEmpires will return a array of Empire", async () => {
        const { readEmpires } = await import('../src/main');
        // Arrange

        // Act
        const empires: Empire[] = await readEmpires()

        // Assert
        expect(empires.length).toEqual(4);
    })

    it("Given list of empires and cites, mapToEmpireObject will return a map of all empires and their cities", async () => {
        const { mapToEmpireObject } = await import('../src/main');
        // Arrange
        const empires: Empire[] = [
            {
                name: "Quebecers",
                empire_id: "1"
            },
            {
                name: "Sherbrookers",
                empire_id: "2"
            }
        ]
        const cities: City[] = [
            {
                name: 'Montreal',
                population: 12,
                empire_id: 1,
                area: 100
            },
            {
                name: 'Quebec',
                population: 14,
                empire_id: 1,
                area: 10
            },
            {
                name: 'Sherbrooke',
                population: 9,
                empire_id: 2,
                area: 1200
            }
        ]

        // Act
        const empiresMap = mapToEmpireObject(cities, empires)

        // Assert
        const expected: EmpiresMap = {
            "Quebecers": {
                name: "Quebecers",
                total_population: 26,
                cities: [
                    cities[0], cities[1]
                ]
            },
            "Sherbrookers": {
                name: "Sherbrookers",
                total_population: 9,
                cities: [cities[2]]
            }
        }
        expect(empiresMap).toEqual(expected);
    })

    it("Given message with content, returnContent returns the message content", async () => {
        const { main, readFile } = await import('../src/main');
        // Arrange

        // Act
        const cities = await readFile("src/cities.csv")

        // Assert
        expect(cities.length).toEqual(9);
    })

    it("Given EmpiresMap, return highest population empire name", async () => {
        const { findHighestPopulationEmpire } = await import('../src/main');
        // Arrange
        const empiresMap: EmpiresMap = {
            "Quebecers": {
                name: "Quebecers",
                total_population: 10,
                cities: []
            },
            "Sherbrookers": {
                name: "Sherbrookers",
                total_population: 9,
                cities: []
            }
        }

        // Act
        const empireWithHighestPopulation = findHighestPopulationEmpire(empiresMap)

        // Assert
        expect(empireWithHighestPopulation).toEqual("Quebecers");
    })

    it("Given EmpiresMap with Sherbbrookers as highst, return sherbrookers", async () => {
        const { findHighestPopulationEmpire } = await import('../src/main');
        // Arrange
        const empiresMap: EmpiresMap = {
            "Quebecers": {
                name: "Quebecers",
                total_population: 10,
                cities: []
            },
            "Sherbrookers": {
                name: "Sherbrookers",
                total_population: 12,
                cities: []
            }
        }

        // Act
        const empireWithHighestPopulation = findHighestPopulationEmpire(empiresMap)

        // Assert
        expect(empireWithHighestPopulation).toEqual("Sherbrookers");
    })
})