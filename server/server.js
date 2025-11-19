import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cache setup
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting setup
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

// Helper function to check rate limit
const checkRateLimit = (ip) => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }
  
  const requests = rateLimit.get(ip).filter(time => time > windowStart);
  rateLimit.set(ip, requests);
  
  if (requests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  requests.push(now);
  return true;
};

// Helper function to clear old cache and rate limits
setInterval(() => {
  const now = Date.now();
  
  // Clear old cache
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
  
  // Clear old rate limits
  const windowStart = now - RATE_LIMIT_WINDOW;
  for (const [ip, requests] of rateLimit.entries()) {
    const filtered = requests.filter(time => time > windowStart);
    if (filtered.length === 0) {
      rateLimit.delete(ip);
    } else {
      rateLimit.set(ip, filtered);
    }
  }
}, 60000); // Run every minute

// Routes
app.get("/api/news/:subreddit", async (req, res) => {
  const subreddit = req.params.subreddit;
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ 
      error: "Too many requests", 
      message: "Please try again in a minute" 
    });
  }
  
  // Check cache
  const cacheKey = `news-${subreddit}`;
  const cached = cache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    return res.json(cached.data);
  }
  
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`
    );
    
    if (!response.ok) {
      throw new Error(`Reddit API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    cache.set(cacheKey, {
      data: data,
      timestamp: Date.now()
    });
    
    res.json(data);
    
  } catch (error) {
    console.error("Error fetching from Reddit:", error);
    
    // Return cached data even if stale if available
    if (cached) {
      return res.json(cached.data);
    }
    
    res.status(500).json({ 
      error: "Failed to fetch from Reddit",
      message: error.message 
    });
  }
});

// New endpoint for multiple subreddits
app.get("/api/news/multiple/:subreddits", async (req, res) => {
  const subreddits = req.params.subreddits.split(',');
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ 
      error: "Too many requests", 
      message: "Please try again in a minute" 
    });
  }
  
  try {
    const promises = subreddits.map(async (subreddit) => {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`
      );
      const data = await response.json();
      return {
        subreddit,
        data: data.data.children.slice(0, 5) // Return only 5 posts per subreddit
      };
    });
    
    const results = await Promise.allSettled(promises);
    const successful = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    
    res.json({ results: successful });
    
  } catch (error) {
    console.error("Error fetching multiple subreddits:", error);
    res.status(500).json({ 
      error: "Failed to fetch from Reddit",
      message: error.message 
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    cacheSize: cache.size,
    rateLimitSize: rateLimit.size
  });
});

// Server info endpoint
app.get("/api/info", (req, res) => {
  res.json({
    name: "GlobalNews API",
    version: "1.0.0",
    description: "Backend API for GlobalNews React application",
    endpoints: {
      "/api/news/:subreddit": "Get hot posts from a specific subreddit",
      "/api/news/multiple/:subreddits": "Get posts from multiple subreddits",
      "/api/health": "Health check endpoint",
      "/api/info": "This information endpoint"
    }
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`ℹ️  API info: http://localhost:${PORT}/api/info`);
});