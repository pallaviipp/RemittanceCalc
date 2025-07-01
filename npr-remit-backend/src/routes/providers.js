import express from 'express';
import { providerService } from '../services/dbService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const providers = await providerService.getProviders();
    res.json({
      success: true,
      providers,
      count: providers.length,
      updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error reading providers:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch providers',
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await providerService.getProvider(id);
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        error: `Provider ${id} not found`
      });
    }
    
    res.json({
      success: true,
      provider,
      updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching provider:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch provider',
      message: error.message
    });
  }
});

export default router;
