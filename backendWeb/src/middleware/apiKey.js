function validateApiKey(req, res, next) {
    const apiKey = process.env.API_KEY; // Get the API key from the environment variable
  
    // Check if the API key is valid
    if (apiKey && apiKey === req.headers['x-api-key']) {
      next(); // Move to the next middleware or route handler
    } else {
      res.status(401).json({ error: 'Invalid API key' });
    }
  }
  
  module.exports = validateApiKey;
  