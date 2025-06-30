import express from 'express';
import { getNRBRates, getCachedRates, getHistoricalRates } from '../services/nrbService.js';

const router = express.Router();

// Get latest exchange rates
router.get('/latest', async (req, res) => {
  try {
    console.log('Fetching latest rates...');
    const rates = await getNRBRates();
    
    res.json({
      success: true,
      rates: rates,
      updated: new Date().toISOString(),
      source: 'Nepal Rastra Bank'
    });
  } catch (error) {
    console.error('Error fetching rates:', error.message);
    
    // Try to return cached rates as fallback
    try {
      const cachedRates = await getCachedRates();
      res.json({
        success: true,
        rates: cachedRates,
        updated: new Date().toISOString(),
        source: 'Cached Data',
        warning: 'Using cached data due to API error'
      });
    } catch (cacheError) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch exchange rates',
        message: error.message
      });
    }
  }
});

// Get rate for specific currency
router.get('/:currency', async (req, res) => {
  try {
    const { currency } = req.params;
    const rates = await getNRBRates();
    
    const rate = rates.find(r => 
      r.currency?.iso3?.toUpperCase() === currency.toUpperCase() ||
      r.currency?.code?.toUpperCase() === currency.toUpperCase()
    );
    
    if (!rate) {
      return res.status(404).json({
        success: false,
        error: `Currency ${currency} not found`
      });
    }
    
    res.json({
      success: true,
      rate: rate,
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

// Get historical rates (placeholder for future implementation)
router.get('/history', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both from and to date parameters'
      });
    }
    
    // For now, return mock historical data
    // In future, implement actual historical data fetching
    const mockHistoricalData = await getHistoricalRates(from, to);
    
    res.json({
      success: true,
      data: mockHistoricalData,
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
