import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  config => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const exchangeRateService = {
  async getLatestRates() {
    try {
      const response = await apiClient.get('/rates/latest');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch exchange rates: ${error.message}`);
    }
  },

  async getHistoricalRates(from, to) {
    try {
      const response = await apiClient.get('/rates/history', {
        params: { from, to }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch historical rates: ${error.message}`);
    }
  },

  async getRateForCurrency(currency) {
    try {
      const response = await apiClient.get(`/rates/${currency}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch rate for ${currency}: ${error.message}`);
    }
  }
};

export const providerService = {
  async getProviders() {
    try {
      const response = await apiClient.get('/providers');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch providers: ${error.message}`);
    }
  },

  async getProvider(id) {
    try {
      const response = await apiClient.get(`/providers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch provider ${id}: ${error.message}`);
    }
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(`Backend health check failed: ${error.message}`);
  }
};

export default apiClient;

