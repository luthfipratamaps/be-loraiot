const router = require('express').Router();
const { mon } = require('../controllers');

// Import the API key validation middleware
const validateApiKey = require('../middleware/apiKey');

// Apply the middleware to the routes that require API key validation
router.get('/data', validateApiKey, mon.getData);
router.get('/data/:date', validateApiKey, mon.getDataByDate);
router.get('/monthly-data/:month', validateApiKey, mon.getDataByMonth);
router.get('/available-dates', validateApiKey, mon.getAvailableDates);
router.get('/download-data/:date', validateApiKey, mon.downloadDataByDate);
router.get('/nodes', validateApiKey, mon.getNodes);

module.exports = router;
