import express from 'express'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const providersPath = path.join(__dirname, '../data/providers.json')
const providers = JSON.parse(readFileSync(providersPath, 'utf8'))

router.get('/', (_, res) => res.json(providers))

export default router
