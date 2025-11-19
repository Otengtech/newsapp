import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, ArrowUp, ExternalLink, Calendar, Image as ImageIcon } from 'lucide-react'

export const NewsCard = ({ post, category, borderColor, index }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  // High-quality fallback images for each category
  const getFallbackImages = () => {
    const fallbacks = {
      world: [
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1489945052260-4f21c52268b9?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'
      ],
      technology: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop'
      ],
      sports: [
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop'
      ],
      science: [
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=400&fit=crop'
      ],
      entertainment: [
        'https://images.unsplash.com/photo-1489599809505-7ed0e5e0e17e?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
      ],
      politics: [
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=400&fit=crop'
      ],
      business: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
      ],
      health: [
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop'
      ]
    }
    return fallbacks[category] || [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop'
    ]
  }

  // Enhanced image loading with fallback chain
  useEffect(() => {
    if (!post.image || !isValidImageUrl(post.image)) {
      // Use fallback images if original is invalid
      const fallbacks = getFallbackImages()
      setCurrentImage(fallbacks[0])
      setImageLoading(false)
      return
    }

    // Start with original image
    setCurrentImage(post.image)
    setImageLoading(true)
    setImageError(false)

    const img = new Image()
    img.src = post.image
    
    const loadTimeout = setTimeout(() => {
      if (imageLoading) {
        tryFallbackImage()
      }
    }, 5000) // 5 second timeout for original image

    img.onload = () => {
      clearTimeout(loadTimeout)
      // Validate image quality
      if (img.naturalWidth >= 300 && img.naturalHeight >= 150) {
        setImageLoading(false)
        setImageError(false)
      } else {
        tryFallbackImage()
      }
    }

    img.onerror = () => {
      clearTimeout(loadTimeout)
      tryFallbackImage()
    }

    const tryFallbackImage = (attempt = 0) => {
      const fallbacks = getFallbackImages()
      if (attempt >= fallbacks.length) {
        // All fallbacks failed, use last one anyway
        setCurrentImage(fallbacks[fallbacks.length - 1])
        setImageLoading(false)
        setImageError(true)
        return
      }

      const fallbackImg = new Image()
      fallbackImg.src = fallbacks[attempt]
      
      const fallbackTimeout = setTimeout(() => {
        if (imageLoading) {
          tryFallbackImage(attempt + 1)
        }
      }, 3000)

      fallbackImg.onload = () => {
        clearTimeout(fallbackTimeout)
        setCurrentImage(fallbacks[attempt])
        setImageLoading(false)
        setImageError(false)
      }

      fallbackImg.onerror = () => {
        clearTimeout(fallbackTimeout)
        tryFallbackImage(attempt + 1)
      }
    }

    return () => {
      clearTimeout(loadTimeout)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [post.image, category])

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!currentImage || !imgRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is already being handled by the main effect
            observerRef.current.disconnect()
          }
        })
      },
      { 
        rootMargin: '200px', // Start loading earlier
        threshold: 0.01 
      }
    )

    observerRef.current.observe(imgRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [currentImage])

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

  // Improved image URL validation
  const isValidImageUrl = (url) => {
    if (!url || !url.startsWith('http')) return false
    
    // Common image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
    const urlLower = url.toLowerCase()
    
    // Common image hosting domains
    const imageDomains = [
      'imgur', 'redd.it', 'i.redd.it', 'unsplash', 'picsum.photos',
      'pexels', 'pixabay', 'flickr', 'images.unsplash.com'
    ]
    
    return imageExtensions.some(ext => urlLower.includes(ext)) || 
           imageDomains.some(domain => urlLower.includes(domain))
  }

  const shouldShowImage = currentImage && !imageError

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 ${borderColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full`}>
      {/* Image Section - Always show an image */}
      <div className="relative h-48 overflow-hidden rounded-t-xl flex-shrink-0" ref={imgRef}>
        {shouldShowImage ? (
          <>
            {/* Loading skeleton */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse flex items-center justify-center z-10">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Loading image...</div>
                </div>
              </div>
            )}
            
            {/* Actual image */}
            <img
              src={currentImage}
              alt={post.title}
              onError={() => {
                setImageError(true)
                setImageLoading(false)
              }}
              onLoad={() => {
                setImageLoading(false)
              }}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              } hover:scale-105`}
              loading="lazy"
              decoding="async"
              importance="low"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              // Force higher quality
              srcSet={`${currentImage}?w=400 400w, ${currentImage}?w=800 800w, ${currentImage}?w=1200 1200w`}
            />
          </>
        ) : (
          // Ultimate fallback - gradient with icon
          <div className={`h-full bg-gradient-to-br ${getFallbackGradient()} rounded-t-xl flex flex-col items-center justify-center p-4 text-center`}>
            <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
            <div className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-1">GlobalNews</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">{category}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Loading content...
            </div>
          </div>
        )}
        
        {/* Category badge overlay */}
        <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wide backdrop-blur-sm">
          {category}
        </div>

        {/* Quality indicator */}
        {!imageLoading && !imageError && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
            HD
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