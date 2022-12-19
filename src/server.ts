import express, { Request } from 'express'
import * as main from './main'
const app = express()

main.init(app)

app.use((req, res, next) => {
    if (req.app.locals['ready']) {
        next()
    } else {
        res.status(503).json({
            error: 'Server is not ready'
        })
    }
})

type EmpireQuery = {
    cities: string,
    filter: string
}

app.get('/api/v1/empires', async (req: Request<{}, {}, {}, EmpireQuery>, res) => {
    try {
        const cities = req.query['cities']?.split(",")
        if (!cities) {
            const empires = await main.findAllEmpires()
            return res.json({
                data: empires
            })
        } else {
            const empires = await main.findEmpiresOfCities(cities)
            if (empires.length == 0) {
                return res.status(400).json({
                    error: `No empire exists for cities ${cities}`
                })
            }
            const highestPopEmpire = main.findHighestPopulationEmpire(empires)
            if (highestPopEmpire) {
                return res.json({
                    message: `Highest population empire of cities ${cities.join(", ")} is ${highestPopEmpire.name}`
                })
            } else {
                res.status(404)
                    .json({
                        error: 'Not found any empires'
                    })
            }
        }
    } catch (err) {
        console.error(err)
    }
})

app.get('/api/v1/cities', async (req: Request<{}, {}, {}, EmpireQuery>, res) => {
    try {
        const filter = req.query['filter']
        if (filter == 'lowestDensity') {
            const lowestDensityCity = await main.findLowestDensityCity()
            return res.json({
                data: lowestDensityCity
            })
        } else {
            return res.status(501).json({
                error: `Method not implemented ${filter ? `for filter ${filter}. Try to use filter 'lowestDensity'` : ''}`
            })
        }
    } catch (err) {
        console.error(err)
    }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
