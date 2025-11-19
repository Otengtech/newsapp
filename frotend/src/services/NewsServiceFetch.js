// services/newsServiceFetch.js
const API_KEY = process.env.REACT_APP_NEWSDATA_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/news';

export const newsService = {
  getNewsByCategory: async (category, options = {}) => {
    const params = new URLSearchParams({
      apikey: API_KEY,
      language: 'en',
      ...(category && category !== 'all' && { category }),
      ...options
    });

    try {
      const response = await fetch(`${BASE_URL}?${params}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  getLatestNews: async (options = {}) => {
    const params = new URLSearchParams({
      apikey: API_KEY,
      language: 'en',
      ...options
    });

    try {
      const response = await fetch(`${BASE_URL}?${params}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }
};