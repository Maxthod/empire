import path from 'path';

type MockEmpire = {
    name: string
    empire_id: number
}

describe('Csv Loader', () => {
    beforeEach(() => {
        jest.resetModules()
    });

    it("will return stream of MockEmpire", async () => {
        // Arrange
        const mockCsv = path.resolve('tests', 'assets', 'mock-empires.csv')
        const { streamCsvLineByLine } = await import('../src/csv')

        // Act
        const empireStream = await streamCsvLineByLine<MockEmpire>(mockCsv, (entry) => {
            return {
                name: entry['name'],
                empire_id: Number(entry['empire_id'])
            }
        })

        // Assert
        const expected = [{
            name: 'Sherbrookers',
            empire_id: 1
        }, {
            name: 'Magogers',
            empire_id: 2
        }, {
            name: 'Lavalois',
            empire_id: 3
        }].reverse()
        for await (const empire of empireStream) {
            expect(empire).toEqual(expected.pop())
        }
    })

})
