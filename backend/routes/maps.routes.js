import express from 'express';
import { 
  getDistance, 
  getDirections, 
  geocodeAddress, 
  reverseGeocode
} from '../utils/maps.utils.js';

const router = express.Router();

router.post('/distance', async (req, res) => {
  try {
    const { origin, destination } = req.body;
    
    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination are required'
      });
    }

    const result = await getDistance(origin, destination);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in distance route:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate distance'
    });
  }
});

// Get directions between two points
router.post('/directions', async (req, res) => {
  try {
    const { origin, destination, waypoints = [] } = req.body;
    
    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination are required'
      });
    }

    const result = await getDirections(origin, destination, waypoints);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in directions route:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get directions'
    });
  }
});

// Geocode an address
router.post('/geocode', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    const result = await geocodeAddress(address);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in geocode route:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to geocode address'
    });
  }
});

// Reverse geocode coordinates
router.post('/reverse-geocode', async (req, res) => {
  try {
    const { coordinates } = req.body;
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Valid coordinates [lng, lat] are required'
      });
    }

    const result = await reverseGeocode(coordinates);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in reverse geocode route:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reverse geocode coordinates'
    });
  }
});


export default router;
