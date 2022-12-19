import { generator_fn } from '../src/csv';
import { CityEntry, EmpireEntry } from '../src/datasource';
import { Empire } from '../src/model';


describe('Datasource Loader', () => {
    beforeEach(() => {
        jest.resetModules()
        async function* mockEmpiresCsvStream(file_path: string, generator: generator_fn<EmpireEntry>) {
            yield generator({
                name: "Babylon",
                empire_id: "1"
            })
            yield generator({
                name: "Baabylon",
                empire_id: "1a"
            })
        }
        async function* mockCitiesCsvStream(file_path: string, generator: generator_fn<CityEntry>) {
            yield generator({
                name: "Babylon1",
                empire_id: "1",
                population: "20",
                area: "2"
            })
            yield generator({
                name: "Babyslon1",
                empire_id: "1",
                population: "20",
                area: "2"
            })
        }
        const asd = jest.fn()
            .mockResolvedValue(() => mockEmpiresCsvStream)
            .mockResolvedValue(mockCitiesCsvStream)
        // jest.mock('../src/csv', () => ({
        //     streamCsvLineByLine: asd,
        //     astreamCsvLineByLine: async function* () {
        //         yield {
        //             name: "Babylon",
        //             empire_id: 1
        //         }
        //         yield {
        //             name: "Babylon1",
        //             empire_id: 1,
        //             population: 20,
        //             area: 2
        //         }
        //         yield {
        //             name: "Teztoco",
        //             empire_id: 2,
        //             population: 30,
        //             area: 10
        //         }
        //         yield {
        //             name: "Indea",
        //             empire_id: 2
        //         }
        //         yield {
        //             name: "Teztoco",
        //             empire_id: 2,
        //             population: 30,
        //             area: 10
        //         }
        //         yield {
        //             name: "Tenoch",
        //             empire_id: 2,
        //             population: 10,
        //             area: 15
        //         }
        //     }
        // }));
    });

    it("will return stream of Empires", async () => {
        // Arrange
        const { dataLoader } = await import('../src/datasource')

        // Act
        const empireStream = await dataLoader.load()

        // Assert
        let expected: Array<Empire> = []
        const babylonianCities = [
            {
                name: "Babylon1",
                population: 20,
                area: 2,
                density: 10
            }
        ]
        const babyLonianEmpire: Empire =
        {
            name: 'Babylon',
            total_population: 20,
            highest_density_city: babylonianCities[0],
            cities: babylonianCities
        }
        expected.push(babyLonianEmpire)

        const aztecCities = [
            {
                name: "Teztoco",
                population: 30,
                area: 10,
                density: 3
            },
            {
                name: "Tenoch",
                population: 10,
                area: 15,
                density: 10 / 15
            }
        ]
        const aztecEmpire: Empire =
        {
            name: "Inka",
            total_population: 40,
            highest_density_city: aztecCities[0],
            cities: aztecCities
        }
        expected.push(aztecEmpire)
        expected = expected.reverse()

        for await (const empire of empireStream) {
            console.log(empire)
            // expect(empire).toEqual(expected.pop())
        }

    })
})
