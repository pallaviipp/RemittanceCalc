import express from 'express'
import { getLatestRates, getHistoricalRates } from '../services/nrbService.js'
const router = express.Router()

router.get('/latest', async (_, res) => {
  const rates = await getLatestRates()
  res.json({ rates, updated: Date.now() })
})

router.get('/history', async (req, res) => {
  const { from, to } = req.query
  const history = await getHistoricalRates(from, to)
  res.json({ history })
})

export default router