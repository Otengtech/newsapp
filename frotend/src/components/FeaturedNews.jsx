import React, { useState } from 'react'
import { TrendingUp, Clock, Eye, Image as ImageIcon, Calendar } from 'lucide-react'

export const FeaturedNews = ({ news, category }) => {
  if (!news || news.length === 0) return null

  const featured = news.slice(0, 2) // Top 3 posts as featured

  const getFallbackGradient = (index) => {
    const gradients = {
      world: index === 0 ? 'from-blue-500 to-blue-600' : 'from-blue-100 to-blue-200',
      technology: index === 0 ? 'from-green-500 to-green-600' : 'from-green-100 to-green-200',
      sports: index === 0 ? 'from-red-500 to-red-600' : 'from-red-100 to-red-200',
      science: index === 0 ? 'from-purple-500 to-purple-600' : 'from-purple-100 to-purple-200',
      entertainment: index === 0 ? 'from-yellow-500 to-yellow-600' : 'from-yellow-100 to-yellow-200',
      politics: index === 0 ? 'from-gray-600 to-gray-700' : 'from-gray-100 to-gray-200',
      business: index === 0 ? 'from-indigo-500 to-indigo-600' : 'from-indigo-100 to-indigo-200',
      health: index === 0 ? 'from-emerald-500 to-emerald-600' : 'from-emerald-100 to-emerald-200'
    }
    return gradients[category] || (index === 0 ? 'from-primary-500 to-primary-600' : 'from-primary-100 to-primary-200')
  }

  const getBorderColor = (index) => {
    const borders = {
      world: index === 0 ? 'border-blue-300' : 'border-blue-200',
      technology: index === 0 ? 'border-green-300' : 'border-green-200',
      sports: index === 0 ? 'border-red-300' : 'border-red-200',
      science: index === 0 ? 'border-purple-300' : 'border-purple-200',
      entertainment: index === 0 ? 'border-yellow-300' : 'border-yellow-200',
      politics: index === 0 ? 'border-gray-400' : 'border-gray-300',
      business: index === 0 ? 'border-indigo-300' : 'border-indigo-200',
      health: index === 0 ? 'border-emerald-300' : 'border-emerald-200'
    }
    return borders[category] || (index === 0 ? 'border-primary-300' : 'border-secondary-200')
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes < 1 ? 'Just now' : `${minutes}m ago`
    }
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const truncateText = (text, length) => {
    if (!text) return ''
    const cleanText = text.replace(/[#*_~`]/g, '')
    return cleanText.length > length ? cleanText.substring(0, length) + '...' : cleanText
  }

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Featured Stories
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Top trending news in {category.charAt(0).toUpperCase() + category.slice(1)}
          </p>
        </div>
      </div>
      
      {/* Featured Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {featured.map((post, index) => (
          <article 
            key={post.id} 
            className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${
              index === 0 ? 'lg:col-span-2' : ''
            } ${getBorderColor(index)} border-2 overflow-hidden`}
          >
            <div className={`flex ${
              index === 0 ? 'flex-col lg:flex-row' : 'flex-col'
            } h-full`}>
              
              {/* Image Section */}
              <div className={`relative ${
                index === 0 ? 'lg:w-1/2 h-72 lg:h-auto' : 'h-56'
              } overflow-hidden`}>
                {post.image && post.image.startsWith('http') ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                
                {/* Fallback Image */}
                <div 
                  className={`w-full h-full flex items-center justify-center ${
                    post.image && post.image.startsWith('http') 
                      ? 'hidden' 
                      : 'flex'
                  } bg-gradient-to-br ${getFallbackGradient(index)}`}
                >
                  <div className="text-center p-6 text-white">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-80" />
                    <div className="text-xl font-bold mb-1">GlobalNews</div>
                    <div className="text-sm opacity-90 uppercase tracking-wide">
                      {category}
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                    <TrendingUp className="h-4 w-4" />
                    <span>#{index + 1} Trending</span>
                  </span>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content Section */}
              <div className={`flex-1 p-6 lg:p-8 flex flex-col justify-between ${
                index === 0 ? 'lg:w-1/2' : ''
              }`}>
                <div>
                  {/* Title */}
                  <h3 className="font-bold text-gray-900 dark:text-white text-xl lg:text-2xl mb-4 line-clamp-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight">
                    {post.title}
                  </h3>
                  
                  {/* Description */}
                  {post.selftext && (
                    <p className="text-gray-600 dark:text-gray-300 text-base mb-6 line-clamp-3 leading-relaxed">
                      {truncateText(post.selftext, index === 0 ? 200 : 120)}
                    </p>
                  )}
                </div>

                {/* Stats and Meta */}
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {post.score?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {formatTime(post.created)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Category Tag */}
                    <div className="text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full uppercase tracking-wide">
                      {category}
                    </div>
                  </div>

                  {/* Author and Date */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.created).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs">
                      by u/{post.author}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* View More Indicator */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
          <span>Showing top 3 featured stories</span>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <span>Scroll down for more news</span>
        </div>
      </div>
    </div>
  )
}