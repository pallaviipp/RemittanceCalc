import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all providers
router.get('/', async (req, res) => {
  try {
    console.log('Fetching providers...');
    const providersPath = path.join(__dirname, '../data/providers.json');
    const data = await fs.readFile(providersPath, 'utf8');
    const providers = JSON.parse(data);
    
    res.json({
      success: true,
      providers: providers,
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

// Get specific provider
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const providersPath = path.join(__dirname, '../data/providers.json');
    const data = await fs.readFile(providersPath, 'utf8');
    const providers = JSON.parse(data);
    
    const provider = providers.find(p => 
      p.id === id || 
      p.name.toLowerCase().replace(/\s+/g, '') === id.toLowerCase()
    );
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        error: `Provider ${id} not found`
      });
    }
    
    res.json({
      success: true,
      provider: provider,
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
