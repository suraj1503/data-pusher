import express from 'express'
import dotenv from 'dotenv'
import accountRoutes from './routes/account-route.js'
import destinationRoute from './routes/destination-route.js'
import appHealth from './routes/app-health-check.js'
import incomingDataRoute from './routes/incoming-data-route.js'
import { errorMiddleware } from './middleware/error.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(express.urlencoded())

app.use('/api/v1/',appHealth)
app.use('/api/v1/account',accountRoutes)
app.use('/api/v1/destination',destinationRoute)
app.use('/api/v1/server',incomingDataRoute)

app.use(errorMiddleware)

app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})