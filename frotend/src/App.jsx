import React, { useState, useEffect } from 'react'
import { NewsGrid } from './components/NewsGrid'
import { Navigation } from './components/Navigation'
import { SearchBar } from './components/SearchBar'
import { LoadingSpinner } from './components/LoadingSpinner'

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

function App() {
  const [activeCategory, setActiveCategory] = useState('world')
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchNews(activeCategory)
  }, [activeCategory])

  const fetchNews = async (category) => {
    setLoading(true)
    try {
      const response = await fetch(`https://www.reddit.com/r/${category}/hot.json?limit=20`)
      const data = await response.json()
      
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
        selftext: post.data.selftext
      }))
      
      setNews(posts)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNews = news.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">GlobalNews</h1>
              <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">Live</span>
            </div>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation 
        categories={Object.keys(SUBREDDITS)} 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        subreddits={SUBREDDITS}
      />

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${SUBREDDITS[activeCategory].color} min-h-screen`}>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {SUBREDDITS[activeCategory].name}
          </h2>
          <p className="text-gray-600 mt-2">Latest updates and breaking news</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <NewsGrid 
            news={filteredNews} 
            category={activeCategory}
            borderColor={SUBREDDITS[activeCategory].border}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">Powered by Reddit API • Real-time global news coverage</p>
            <p className="text-gray-500 text-sm mt-2">Updated continuously</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App