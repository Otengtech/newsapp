// services/newsService.js

const API_BASE_URL = 'https://newsapp-agx5.onrender.com/api';

export const newsService = {
  // Get news from Reddit via your backend
  getNewsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${category}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Get latest news (same as category but for all)
  getLatestNews: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/world`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Search news - this would need to be implemented in your backend
  searchNews: async (query, category = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          category: category || undefined
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search news: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  }
};