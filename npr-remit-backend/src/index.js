import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import rateRoutes from './routes/rates.js'
import providerRoutes from './routes/providers.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/rates', rateRoutes)
app.use('/api/providers', providerRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))