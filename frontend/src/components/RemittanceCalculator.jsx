import React, { useState, useEffect } from 'react';
import {
  Calculator, DollarSign, TrendingUp, TrendingDown,
  Building2, Phone, Globe, RefreshCw, Clock, Star,
  ArrowRight, Zap, Shield, Award, ChevronDown,
  Users, Target, Sparkles, Heart, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { providerService } from '../services/apiService';

// API Service Layer
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error interceptor for better error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

const exchangeRateService = {
  async getLatestRates() {
    try {
      const response = await apiClient.get('/rates/latest');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch exchange rates');
    }
  },

  async getHistoricalRates(from, to) {
    try {
      const response = await apiClient.get('/rates/history', {
        params: { from, to }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch historical rates');
    }
  }
};


// Enhanced currency metadata
const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' }
];

// Quick amount presets
const quickAmounts = {
  USD: [100, 500, 1000, 2000, 5000],
  EUR: [100, 500, 1000, 2000, 5000],
  GBP: [100, 500, 1000, 2000, 5000],
  AUD: [100, 500, 1000, 2000, 5000],
  CAD: [100, 500, 1000, 2000, 5000],
  JPY: [10000, 50000, 100000, 200000, 500000]
};

// Enhanced translations
const translations = {
  en: {
    title: "Nepal Remittance Calculator",
    subtitle: "Find the best rates to send money to Nepal",
    hero: "Send money to Nepal with confidence",
    heroSubtitle: "Compare real-time rates from top providers and save on every transfer",
    sendAmount: "Send Amount",
    enterAmount: "Enter amount to send",
    fromCurrency: "From Currency",
    selectCurrency: "Select currency",
    currentRate: "Live Rate",
    refresh: "Refresh",
    quickAmounts: "Quick Amounts",
    bestDeal: "Best Deal",
    youReceive: "You'll receive",
    totalCost: "Total cost",
    fees: "Fees",
    savingsText: "vs highest cost provider",
    compareAll: "Compare All Providers",
    processingTime: "Processing Time",
    rating: "Rating",
    reviews: "reviews",
    trustScore: "Trust Score",
    features: "Features",
    selectProvider: "Choose Provider",
    marketInsights: "Market Insights",
    rateChange: "24h Change",
    bestTime: "Best time to send",
    now: "Right now",
    language: "Language",
    liveRates: "Live Rates",
    updated: "Updated",
    ago: "ago",
    popular: "Popular",
    recommended: "Recommended",
    fastest: "Fastest",
    cheapest: "Cheapest",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    fetchingRates: "Fetching latest rates...",
    noData: "No data available"
  },
  ne: {
    title: "नेपाल पैसा पठाउने क्यालकुलेटर",
    subtitle: "नेपालमा पैसा पठाउने सबैभन्दा राम्रो दर फेला पार्नुहोस्",
    hero: "नेपालमा विश्वासका साथ पैसा पठाउनुहोस्",
    heroSubtitle: "शीर्ष प्रदायकहरूको वास्तविक समयको दरहरू तुलना गर्नुहोस् र हरेक स्थानान्तरणमा बचत गर्नुहोस्",
    sendAmount: "पठाउने रकम",
    enterAmount: "पठाउने रकम लेख्नुहोस्",
    fromCurrency: "मुद्राबाट",
    selectCurrency: "मुद्रा छान्नुहोस्",
    currentRate: "लाइभ दर",
    refresh: "रिफ्रेस",
    quickAmounts: "छिटो रकम",
    bestDeal: "सबैभन्दा राम्रो सम्झौता",
    youReceive: "तपाईंले पाउनुहुनेछ",
    totalCost: "कुल लागत",
    fees: "शुल्क",
    savingsText: "सबैभन्दा महंगो प्रदायकको तुलनामा",
    compareAll: "सबै प्रदायकहरू तुलना गर्नुहोस्",
    processingTime: "प्रशोधन समय",
    rating: "मूल्याङ्कन",
    reviews: "समीक्षाहरू",
    trustScore: "भरोसा स्कोर",
    features: "सुविधाहरू",
    selectProvider: "प्रदायक छान्नुहोस्",
    marketInsights: "बजार अन्तर्दृष्टि",
    rateChange: "२४ घण्टाको परिवर्तन",
    bestTime: "पठाउने सबैभन्दा राम्रो समय",
    now: "अहिले नै",
    language: "भाषा",
    liveRates: "लाइभ दरहरू",
    updated: "अपडेट गरिएको",
    ago: "अघि",
    popular: "लोकप्रिय",
    recommended: "सुझावित",
    fastest: "सबैभन्दा छिटो",
    cheapest: "सबैभन्दा सस्तो",
    loading: "लोड हुँदै...",
    error: "त्रुटि",
    retry: "फेरि प्रयास गर्नुहोस्",
    fetchingRates: "नवीनतम दरहरू ल्याउँदै...",
    noData: "कुनै डेटा उपलब्ध छैन"
  }
};

// Error Message Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
        <span className="text-red-800">{message}</span>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="text-red-600 hover:text-red-800 underline text-sm"
        >
          Retry
        </button>
      )}
    </div>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = ({ message }) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

const RemittanceCalculator = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState({
    rates: false,
    providers: false
  });
  const [error, setError] = useState({
    rates: null,
    providers: null
  });
  const [isNepali, setIsNepali] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const t = translations[isNepali ? 'ne' : 'en'];

  // Fetch exchange rates on component mount and currency change
  useEffect(() => {
    fetchExchangeRates();
  }, [fromCurrency]);

  // Fetch providers on component mount
  useEffect(() => {
    fetchProviders();
  }, []);

  const transformNRBRates = (nrbRates) => {
    const transformed = {};
    if (Array.isArray(nrbRates)) {
      nrbRates.forEach(rate => {
        if (rate.currency && rate.sell) {
          const currencyCode = rate.currency.iso3 || rate.currency.code;
          transformed[currencyCode] = {
            current: parseFloat(rate.sell),
            change24h: calculateChange(rate),
            trend: parseFloat(rate.sell) > parseFloat(rate.buy || rate.sell) ? 'up' : 'down'
          };
        }
      });
    }
    return transformed;
  };

  const calculateChange = (rate) => {
    // This would need historical data from the API
    // For now, returning a simulated change
    const change = (Math.random() - 0.5) * 2;
    return parseFloat(change.toFixed(2));
  };

  const transformProviderData = (backendProviders) => {
    return backendProviders.map((provider, index) => ({
      id: provider.name.toLowerCase().replace(/\s+/g, ''),
      name: provider.name,
      logo: getProviderLogo(provider.name),
      fee: provider.feeUsd || 15,
      feeType: provider.feeType || 'flat',
      exchangeRate: getCurrentRate() + (provider.rateMargin || 0),
      processingTime: getProcessingTime(provider.name),
      rating: provider.rating || 4.5,
      reviews: provider.reviews || 1000,
      branches: getBranchInfo(provider.name),
      online: provider.online !== false,
      features: getFeatures(provider.name),
      trustScore: provider.trustScore || 90,
      color: getProviderColor(index),
      notes: provider.notes
    }));
  };

  const getProviderLogo = (name) => {
    const logoMap = {
      'ime': '🏦',
      'esewa': '💳',
      'prabhu': '🏪',
      'western union': '🌐',
      'remitly': '📱'
    };
    return logoMap[name.toLowerCase()] || '🏢';
  };

  const getProcessingTime = (name) => {
    const timeMap = {
      'ime': '2-3 hours',
      'esewa': 'Instant',
      'prabhu': '1-2 hours',
      'western union': '15-30 mins',
      'remitly': '30 mins - 2 hours'
    };
    return timeMap[name.toLowerCase()] || '1-2 hours';
  };

  const getBranchInfo = (name) => {
    const branchMap = {
      'ime': '500+ branches',
      'esewa': 'Digital only',
      'prabhu': '300+ branches',
      'western union': 'Global network',
      'remitly': 'App only'
    };
    return branchMap[name.toLowerCase()] || 'Multiple locations';
  };

  const getFeatures = (name) => {
    const featureMap = {
      'ime': ['Mobile App', '24/7 Support', 'Cash Pickup'],
      'esewa': ['Instant Transfer', 'Low Fees', 'Digital Wallet'],
      'prabhu': ['Wide Network', 'Reliable', 'Cash Pickup'],
      'western union': ['Global Reach', 'Fast Transfer', 'Trusted Brand'],
      'remitly': ['Mobile First', 'Competitive Rates', 'Fast Processing']
    };
    return featureMap[name.toLowerCase()] || ['Reliable', 'Secure', 'Fast'];
  };

  const getProviderColor = (index) => {
    const colors = ['blue', 'green', 'purple', 'yellow', 'indigo'];
    return colors[index % colors.length];
  };

  const getCurrentRate = () => {
    return exchangeRates[fromCurrency]?.current || 132.45;
  };

  const fetchExchangeRates = async () => {
    setLoading(prev => ({ ...prev, rates: true }));
    setError(prev => ({ ...prev, rates: null }));
    
    try {
      const ratesData = await exchangeRateService.getLatestRates();
      const transformedRates = transformNRBRates(ratesData.rates || ratesData);
      setExchangeRates(transformedRates);
      setLastUpdated(new Date(ratesData.updated || Date.now()));
    } catch (err) {
      console.error('Failed to fetch exchange rates:', err);
      setError(prev => ({ ...prev, rates: 'Failed to fetch exchange rates' }));
      // Fallback to mock data
      setExchangeRates({
        USD: { current: 132.45, change24h: +0.85, trend: 'up' },
        EUR: { current: 144.20, change24h: -0.45, trend: 'down' },
        GBP: { current: 168.75, change24h: +1.20, trend: 'up' },
        AUD: { current: 87.30, change24h: +0.35, trend: 'up' },
        CAD: { current: 97.85, change24h: -0.25, trend: 'down' },
        JPY: { current: 0.89, change24h: +0.02, trend: 'up' }
      });
    } finally {
      setLoading(prev => ({ ...prev, rates: false }));
    }
  };

  const fetchProviders = async () => {
    setLoading(prev => ({ ...prev, providers: true }));
    setError(prev => ({ ...prev, providers: null }));
    
    try {
      const response = await providerService.getProviders();
      // Extract providers array from response
      const providersArray = response.providers;
      
      const transformedProviders = transformProviderData(providersArray);
      setProviders(transformedProviders);
    } catch (err) {
      console.error('Failed to fetch providers:', err);
      setError(prev => ({ ...prev, providers: 'Failed to fetch providers' }));
      // Fallback to mock data
      setProviders([
        {
          id: 'ime', name: 'IME Ltd.', logo: '🏦', 
          fee: 15, feeType: 'flat', exchangeRate: 132.20,
          processingTime: '2-3 hours', rating: 4.8, reviews: 2847,
          branches: '500+ branches', online: true, 
          features: ['Mobile App', '24/7 Support', 'Cash Pickup'],
          trustScore: 95, color: 'blue'
        },
        {
          id: 'esewa', name: 'eSewa Money Transfer', logo: '💳',
          fee: 1.5, feeType: 'percentage', exchangeRate: 132.10,
          processingTime: 'Instant', rating: 4.6, reviews: 1523,
          branches: 'Digital only', online: true,
          features: ['Instant Transfer', 'Low Fees', 'Digital Wallet'],
          trustScore: 92, color: 'green'
        },
        {
          id: 'prabhu', name: 'Prabhu Money Transfer', logo: '🏪',
          fee: 20, feeType: 'flat', exchangeRate: 132.35,
          processingTime: '1-2 hours', rating: 4.7, reviews: 3241,
          branches: '300+ branches', online: true,
          features: ['Wide Network', 'Reliable', 'Cash Pickup'],
          trustScore: 94, color: 'purple'
        }
      ]);
    } finally {
      setLoading(prev => ({ ...prev, providers: false }));
    }
  };

  const refreshRates = async () => {
    await fetchExchangeRates();
  };

  const calculateFee = (bank, sendAmount) => {
    if (!sendAmount || isNaN(sendAmount)) return 0;
    return bank.feeType === 'percentage' ? (sendAmount * bank.fee) / 100 : bank.fee;
  };

  const calculateTotal = (bank, sendAmount) => {
    if (!sendAmount || isNaN(sendAmount)) {
      return { fee: 0, nprAmount: 0, totalCost: 0 };
    }
    
    const fee = calculateFee(bank, sendAmount);
    const nprAmount = sendAmount * bank.exchangeRate;
    return {
      fee,
      nprAmount,
      totalCost: sendAmount + fee,
    };
  };

  const getProviderComparison = () => {
    if (!amount || isNaN(parseFloat(amount))) return [];
    
    const sendAmount = parseFloat(amount);
    if (sendAmount <= 0) return [];
    
    const providersWithCalc = providers.map(bank => ({
      ...bank,
      ...calculateTotal(bank, sendAmount),
    })).sort((a, b) => b.nprAmount - a.nprAmount);
    
    return providersWithCalc.map((provider, index) => ({
      ...provider,
      rank: index + 1,
      isBest: index === 0,
      savings: index === 0 ? 0 : providersWithCalc[0].nprAmount - provider.nprAmount
    }));
  };

  const formatCurrency = (value, currency = 'NPR') => {
    if (!value || isNaN(value)) return currency === 'NPR' ? 'Rs. 0.00' : '0.00';
    
    const curr = currencies.find(c => c.code === currency);
    const symbol = currency === 'NPR' ? 'Rs. ' : (curr?.symbol || '');
    return `${symbol}${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const currentRate = exchangeRates[fromCurrency];
  const providerComparison = getProviderComparison();
  const bestProvider = providerComparison.length > 0 ? providerComparison[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pt-12 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Language Toggle & Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{t.title}</h1>
                <p className="text-blue-100 text-lg">{t.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full p-1">
              <button
                onClick={() => setIsNepali(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !isNepali ? 'bg-white text-blue-600 shadow-sm' : 'text-white text-opacity-80 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setIsNepali(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isNepali ? 'bg-white text-blue-600 shadow-sm' : 'text-white text-opacity-80 hover:text-white'
                }`}
              >
                नेपाली
              </button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {t.hero}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Error Messages */}
          {error.rates && (
            <div className="max-w-4xl mx-auto mb-6">
              <ErrorMessage message={error.rates} onRetry={fetchExchangeRates} />
            </div>
          )}
          {error.providers && (
            <div className="max-w-4xl mx-auto mb-6">
              <ErrorMessage message={error.providers} onRetry={fetchProviders} />
            </div>
          )}

          {/* Main Calculator Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Input */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <DollarSign className="w-4 h-4" />
                    {t.sendAmount}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full text-2xl font-bold border-2 border-gray-200 rounded-xl p-4 pr-16 focus:border-blue-500 focus:ring-0 transition-colors"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                      {currencies.find(c => c.code === fromCurrency)?.symbol}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Globe className="w-4 h-4" />
                    {t.fromCurrency}
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg font-medium focus:border-blue-500 focus:ring-0 transition-colors appearance-none bg-white"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Amounts */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">{t.quickAmounts}</label>
                  <div className="flex flex-wrap gap-2">
                    {quickAmounts[fromCurrency]?.map(preset => (
                      <button
                        key={preset}
                        onClick={() => setAmount(preset.toString())}
                        className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        {formatCurrency(preset, fromCurrency)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Rate */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                  {loading.rates ? (
                    <LoadingSpinner message={t.fetchingRates} />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t.currentRate}</p>
                        <p className="text-xl font-bold text-gray-900">
                          1 {fromCurrency} = Rs. {currentRate?.current || 0}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                          currentRate?.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {currentRate?.trend === 'up' ? 
                            <TrendingUp className="w-4 h-4" /> : 
                            <TrendingDown className="w-4 h-4" />
                          }
                          {currentRate?.change24h > 0 ? '+' : ''}{currentRate?.change24h || 0}
                        </div>
                        <button
                          onClick={refreshRates}
                          disabled={loading.rates}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-1 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${loading.rates ? 'animate-spin' : ''}`} />
                          {t.refresh}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Results */}
              <div className="space-y-6">
                {loading.providers ? (
                  <LoadingSpinner message="Loading providers..." />
                ) : amount && parseFloat(amount) > 0 && bestProvider ? (
                  <>
                    {/* Best Deal Card */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5" />
                        <span className="font-semibold">{t.bestDeal}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">
                          {formatCurrency(bestProvider.nprAmount)}
                        </p>
                        <p className="text-green-100">
                          via {bestProvider.name} {bestProvider.logo}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-green-100">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {bestProvider.processingTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-current" />
                            {bestProvider.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Send Amount</span>
                          <span className="font-medium">{formatCurrency(parseFloat(amount), fromCurrency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fees</span>
                          <span className="font-medium">{formatCurrency(bestProvider.fee, fromCurrency)}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between">
                          <span className="font-semibold">Total Cost</span>
                          <span className="font-bold">{formatCurrency(bestProvider.totalCost, fromCurrency)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compare All Button */}
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {t.compareAll}
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showComparison ? 'transform rotate-180' : ''}`} />
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                      <Calculator className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Calculate</h3>
                    <p className="text-gray-600">Enter an amount to see the best rates</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      {showComparison && amount && parseFloat(amount) > 0 && providerComparison.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Providers Comparison</h2>
            <p className="text-gray-600">Compare all available options for sending {formatCurrency(parseFloat(amount), fromCurrency)}</p>
          </div>

          <div className="grid gap-6">
            {providerComparison.map((provider, index) => (
              <div
                key={provider.id}
                className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                  provider.isBest ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Provider Info */}
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{provider.logo}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
                        {provider.isBest && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {t.recommended}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {provider.rating} ({provider.reviews.toLocaleString()} {t.reviews})
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          {provider.trustScore}% trust
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rate & Amount */}
                  <div className="text-center lg:text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(provider.nprAmount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Rate: Rs. {provider.exchangeRate} • Fee: {formatCurrency(provider.fee, fromCurrency)}
                    </p>
                  </div>

                  {/* Processing Time & Features */}
                  <div className="text-center lg:text-right">
                    <div className="flex items-center justify-center lg:justify-end gap-1 text-sm text-gray-600 mb-2">
                      <Clock className="w-4 h-4" />
                      {provider.processingTime}
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center lg:justify-end">
                      {provider.features.slice(0, 2).map(feature => (
                        <span key={feature} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    <button className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      provider.isBest 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                      {t.selectProvider}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Insights */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.marketInsights}</h2>
            <p className="text-gray-600">Stay informed with live exchange rates and market trends</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currencies.slice(0, 3).map(currency => {
              const rate = exchangeRates[currency.code];
              return (
                <div key={currency.code} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currency.flag}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{currency.code}</h3>
                        <p className="text-sm text-gray-600">{currency.name}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${
                      rate?.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {rate?.trend === 'up' ? 
                        <TrendingUp className="w-4 h-4" /> : 
                        <TrendingDown className="w-4 h-4" />
                      }
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-900">Rs. {rate?.current || 0}</p>
                    <p className={`text-sm font-medium ${
                      (rate?.change24h || 0) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(rate?.change24h || 0) > 0 ? '+' : ''}{rate?.change24h || 0} (24h)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <span>Built with love for the Nepali community</span>
          </div>
          <p className="text-gray-400 text-sm">
            {t.updated} {lastUpdated.toLocaleTimeString()} • Rates may vary by provider
          </p>
        </div>
      </div>
    </div>
  );
};

export default RemittanceCalculator;
