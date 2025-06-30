import axios from 'axios'
const BASE = 'https://www.nrb.org.np/api/forex/v1/rates'

export async function getLatestRates() {
  const { data } = await axios.get(BASE)
  return data.data.payload
}

export async function getHistoricalRates(from, to) {
  const { data } = await axios.get(BASE, { params: { from, to, per_page: 100, page: 1 }})
  return data.data.payload
}