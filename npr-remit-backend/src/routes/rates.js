import express from 'express';
import { exchangeRateService } from '../services/dbService.js';
import { getNRBRates } from '../services/nrbService.js';

const router = express.Router();

// Get latest exchange rates
router.get('/latest', async (req, res) => {
  try {
    // Try to get rates from database first
    let rates = await exchangeRateService.getLatestRates();

    // If no rates in DB, fetch from NRB and save to DB
    if (!rates || rates.length === 0) {
      rates = await getNRBRates();
      await Promise.all(rates.map(rate =>
        exchangeRateService.createRate(rate)
      ));
    }

    res.json({
      success: true,
      rates,
      updated: new Date().toISOString(),
      source: 'Database'
    });
  } catch (error) {
    console.error('Error fetching rates:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch exchange rates',
      message: error.message
    });
  }
});

// Get rate for specific currency
router.get('/:currency', async (req, res) => {
  try {
    const { currency } = req.params;
    let rates = await exchangeRateService.getLatestRates();

    // If no rates in DB, fetch from NRB and save to DB
    if (!rates || rates.length === 0) {
      rates = await getNRBRates();
      await Promise.all(rates.map(rate =>
        exchangeRateService.createRate(rate)
      ));
    }

    const rate = rates.find(r =>
      r.currency?.toUpperCase() === currency.toUpperCase()
    );

    if (!rate) {
      return res.status(404).json({
        success: false,
        error: `Currency ${currency} not found`
      });
    }

    res.json({
      success: true,
      rate,
      currency: currency.toUpperCase(),
      updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching rate:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch currency rate',
      message: error.message
    });
  }
});

// Get historical rates
router.get('/history', async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both from and to date parameters'
      });
    }

    const historicalData = await exchangeRateService.getHistoricalRates(from, to);

    res.json({
      success: true,
      data: historicalData,
      period: { from, to },
      updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching historical rates:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical rates',
      message: error.message
    });
  }
});

export default router;
