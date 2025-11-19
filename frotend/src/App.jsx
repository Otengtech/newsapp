import React, { useState, useEffect } from 'react'
import { NewsGrid } from './components/NewsGrid'
import Navigation from './components/Navigation'
import { SearchBar } from './components/SearchBar'
import { LoadingSpinner } from './components/LoadingSpinner'
import { FeaturedNews } from './components/FeaturedNews'
import { NewsTicker } from './components/NewsTicker'
import { CategoryStats } from './components/CategoryStats'
import ScrollToTop from './components/ScrollToTop'

const SUBREDDITS = {
  world: { name: 'World News', color: 'bg-blue-50', border: 'border-blue-200' },
  technology: { name: 'Technology', color: 'bg-green-50', border: 'border-green-200' },
  sports: { name: 'Sports', color: 'bg-red-50', border: 'border-red-200' },
  science: { name: 'Science', color: 'bg-purple-50', border: 'border-purple-200' },
  entertainment: { name: 'Entertainment', color: 'bg-yellow-50', border: 'border-yellow-200' },
  politics: { name: 'Politics', color: 'bg-gray-100', border: 'border-gray-300' },
  business: { name: 'Business', color: 'bg-indigo-50', border: 'border-indigo-200' },
  health: { name: 'Health', color: 'bg-emerald-50', border: 'border-emerald-200' }
}

// Backend API base URL
const API_BASE_URL = "https://newsapp-agx5.onrender.com/api"

function App() {
  const [activeCategory, setActiveCategory] = useState('world')
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNews(activeCategory)
  }, [activeCategory])

  const fetchNews = async (category) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/news/${category}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Transform the data from your backend
      const posts = data.data.children.map(post => ({
        id: post.data.id,
        title: post.data.title,
        author: post.data.author,
        score: post.data.score,
        comments: post.data.num_comments,
        created: new Date(post.data.created_utc * 1000),
        url: `https://reddit.com${post.data.permalink}`,
        image: post.data.thumbnail && post.data.thumbnail.startsWith('http') ? post.data.thumbnail : null,
        domain: post.data.domain,
        selftext: post.data.selftext,
        upvote_ratio: post.data.upvote_ratio
      }))
      
      setNews(posts)
    } catch (error) {
      console.error('Error fetching news:', error)
      setError(error.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setSearchQuery('') // Clear search when refreshing
    fetchNews(activeCategory)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const filteredNews = news.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.selftext && post.selftext.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const currentTheme = SUBREDDITS[activeCategory]

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200">
      {/* Header */}
      <ScrollToTop />
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">GlobalNews</h1>
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Live</span>
              </div>
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-blue-400 hover:bg-blue-300 text-white px-4 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{refreshing ? 'Refresh...' : 'Refresh'}</span>
                {refreshing && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation 
        categories={Object.keys(SUBREDDITS)} 
        onSearch={handleSearch}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        subreddits={SUBREDDITS}
      />

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${currentTheme.color} min-h-screen transition-colors duration-200`}>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 font-medium">
                Error loading news: {error}
              </div>
              <button
                onClick={handleRefresh}
                className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Refresh Status */}
        {refreshing && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <div className="text-blue-600 font-medium">Refreshing news...</div>
            </div>
          </div>
        )}

        {/* News Ticker */}
        <NewsTicker news={news} />

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {SUBREDDITS[activeCategory].name}
              </h2>
              <p className="text-gray-600 mt-2">
                Latest updates and breaking news from around the world
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredNews.length} stories • Updated just now
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <CategoryStats news={news} category={activeCategory} />

        {/* Featured News */}
        {!loading && !searchQuery && !error && !refreshing && (
          <FeaturedNews news={news} category={activeCategory} />
        )}

        {/* Loading or News Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-2">Failed to load news</div>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <NewsGrid 
            news={filteredNews} 
            category={activeCategory}
            borderColor={currentTheme.border}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  GlobalNews
                </h3>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Your trusted source for real-time news from around the world. 
                Powered by Reddit communities and updated continuously with the latest global events.
              </p>
              <div className="flex space-x-4 mt-6">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">in</span>
                </div>
              </div>
            </div>
            
            {/* Categories Section */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">News Categories</h4>
              <div className="space-y-3">
                {Object.entries(SUBREDDITS).map(([key, { name }]) => (
                  <div 
                    key={key} 
                    className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200 flex items-center group"
                    onClick={() => setActiveCategory(key)}
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Information Section */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Information</h4>
              <div className="space-y-3">
                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 py-1">
                  About Us
                </div>
                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 py-1">
                  Privacy Policy
                </div>
                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 py-1">
                  Terms of Service
                </div>
                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 py-1">
                  Contact Support
                </div>
                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 py-1">
                  FAQ
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-center md:text-left">
                <p className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                  <span>Powered by Reddit API</span>
                  <span className="hidden md:inline">•</span>
                  <span>Real-time global news coverage</span>
                  <span className="hidden md:inline">•</span>
                  <span>Built with React & Express</span>
                </p>
                <p className="text-sm mt-2 flex items-center justify-center md:justify-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Backend server running on Render
                </p>
              </div>
              
              <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} GlobalNews. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App