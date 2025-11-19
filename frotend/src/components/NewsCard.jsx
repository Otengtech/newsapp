import React, { useState, useEffect } from 'react'
import { MessageCircle, ArrowUp, ArrowDown, ExternalLink, Calendar, Image as ImageIcon } from 'lucide-react'

export const NewsCard = ({ post, category, borderColor, index }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [hasValidImage, setHasValidImage] = useState(false)

  // Check if image is valid and load properly
  useEffect(() => {
    if (post.image && post.image.startsWith('http')) {
      const img = new Image()
      img.src = post.image
      img.onload = () => {
        setHasValidImage(true)
        setImageLoading(false)
      }
      img.onerror = () => {
        setHasValidImage(false)
        setImageLoading(false)
        setImageError(true)
      }
    } else {
      setHasValidImage(false)
      setImageLoading(false)
    }
  }, [post.image])

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes < 1 ? 'Just now' : `${minutes}m ago`
    }
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const truncateText = (text, length) => {
    if (!text) return ''
    const cleanText = text.replace(/[#*_~`]/g, '') // Remove markdown characters
    return cleanText.length > length ? cleanText.substring(0, length) + '...' : cleanText
  }

  const getFallbackGradient = () => {
    const gradients = {
      world: 'from-blue-50 to-blue-100',
      technology: 'from-green-50 to-green-100',
      sports: 'from-red-50 to-red-100',
      science: 'from-purple-50 to-purple-100',
      entertainment: 'from-yellow-50 to-yellow-100',
      politics: 'from-gray-100 to-gray-200',
      business: 'from-indigo-50 to-indigo-100',
      health: 'from-emerald-50 to-emerald-100'
    }
    return gradients[category] || 'from-primary-50 to-secondary-50'
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 ${borderColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full`}>
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden rounded-t-xl flex-shrink-0">
        {hasValidImage && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400">Loading image...</div>
              </div>
            )}
            <img
              src={post.image}
              alt={post.title}
              onError={() => {
                setImageError(true)
                setImageLoading(false)
              }}
              onLoad={() => setImageLoading(false)}
              className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
              decoding="async"
            />
          </>
        ) : (
          <div className={`h-full bg-gradient-to-br ${getFallbackGradient()} rounded-t-xl flex flex-col items-center justify-center p-4 text-center`}>
            <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
            <div className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-1">GlobalNews</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">{category}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">No image available</div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 
          className="font-semibold text-gray-900 dark:text-white mb-3 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-3 flex-1"
          onClick={() => setExpanded(!expanded)}
          title={post.title}
        >
          {expanded ? post.title : truncateText(post.title, 100)}
        </h3>

        {/* Description */}
        {post.selftext && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {expanded ? post.selftext : truncateText(post.selftext, 120)}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 flex-wrap gap-2">
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              <ArrowUp className="h-3 w-3 text-green-500 flex-shrink-0" />
              <span className="text-xs font-medium">{post.score?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              <MessageCircle className="h-3 w-3 text-blue-500 flex-shrink-0" />
              <span className="text-xs font-medium">{post.comments?.toLocaleString() || 0}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="text-xs font-medium">{formatTime(post.created)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600 mt-auto">
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mr-2" title={`by u/${post.author}`}>
            by u/{post.author}
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg transition-colors whitespace-nowrap"
            >
              {expanded ? 'Show Less' : 'Read More'}
            </button>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Source</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}