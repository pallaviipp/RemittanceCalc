import axios from 'axios';

const NRB_API_URL = 'https://www.nrb.org.np/api/forex/v1/rates';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

let cachedRates = null;
let lastFetchTime = null;

export const getNRBRates = async () => {
  try {
    // Check if we have cached data that's still fresh
    if (cachedRates && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
      console.log('Returning cached rates...');
      return cachedRates;
    }

    console.log('Fetching fresh rates from NRB API...');
    const response = await axios.get(NRB_API_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'RemittanceCalc/1.0.0',
        'Accept': 'application/json'
      }
    });

    if (response.data && response.data.data && response.data.data.payload) {
      const rates = response.data.data.payload;
      
      // Cache the results
      cachedRates = rates;
      lastFetchTime = Date.now();
      
      console.log(`Successfully fetched ${rates.length} exchange rates`);
      return rates;
    } else {
      throw new Error('Invalid response structure from NRB API');
    }
  } catch (error) {
    console.error('NRB API Error:', error.message);
    
    // If we have cached data, return it even if stale
    if (cachedRates) {
      console.log('Returning stale cached rates due to API error...');
      return cachedRates;
    }
    
    // Otherwise, return fallback mock data
    console.log('Returning fallback mock data...');
    return getFallbackRates();
  }
};

export const getCachedRates = async () => {
  if (cachedRates) {
    return cachedRates;
  }
  return getFallbackRates();
};

export const getHistoricalRates = async (from, to) => {
  // Mock implementation for historical data
  // In a real scenario, you'd fetch this from a database or another API
  const mockData = [];
  const startDate = new Date(from);
  const endDate = new Date(to);
  const currentRates = await getNRBRates();
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    mockData.push({
      date: d.toISOString().split('T')[0],
      rates: currentRates.map(rate => ({
        ...rate,
        sell: parseFloat(rate.sell) + (Math.random() - 0.5) * 2 // Add some variance
      }))
    });
  }
  
  return mockData;
};

const getFallbackRates = () => {
  return [
    {
      currency: { iso3: 'USD', name: 'US Dollar', unit: 1 },
      buy: '131.95',
      sell: '132.45'
    },
    {
      currency: { iso3: 'EUR', name: 'Euro', unit: 1 },
      buy: '143.70',
      sell: '144.20'
    },
    {
      currency: { iso3: 'GBP', name: 'Pound Sterling', unit: 1 },
      buy: '168.25',
      sell: '168.75'
    },
    {
      currency: { iso3: 'AUD', name: 'Australian Dollar', unit: 1 },
      buy: '86.80',
      sell: '87.30'
    },
    {
      currency: { iso3: 'CAD', name: 'Canadian Dollar', unit: 1 },
      buy: '97.35',
      sell: '97.85'
    },
    {
      currency: { iso3: 'JPY', name: 'Japanese Yen', unit: 100 },
      buy: '0.87',
      sell: '0.89'
    }
  ];
};
