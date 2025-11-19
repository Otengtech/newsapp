import React, { useState, useEffect } from 'react'
import { TrendingUp, Clock, Eye, Image as ImageIcon, Calendar } from 'lucide-react'

export const FeaturedNews = ({ news, category }) => {
  if (!news || news.length === 0) return null

  const featured = news.slice(0, 2) // Top 2 posts as featured

  // High-quality fallback images for each category
  const getFallbackImages = (category) => {
    const fallbacks = {
      world: [
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1489945052260-4f21c52268b9?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop'
      ],
      technology: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop'
      ],
      sports: [
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=600&fit=crop'
      ],
      science: [
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&h=600&fit=crop'
      ],
      entertainment: [
        'https://images.unsplash.com/photo-1489599809505-7ed0e5e0e17e?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop'
      ],
      politics: [
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1200&h=600&fit=crop'
      ],
      business: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop'
      ],
      health: [
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=600&fit=crop'
      ]
    }
    return fallbacks[category] || [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=600&fit=crop'
    ]
  }

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

  // Enhanced image URL validation
  const isValidImageUrl = (url) => {
    if (!url || !url.startsWith('http')) return false
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
    const urlLower = url.toLowerCase()
    
    const imageDomains = [
      'imgur', 'redd.it', 'i.redd.it', 'unsplash', 'picsum.photos',
      'pexels', 'pixabay', 'flickr', 'images.unsplash.com'
    ]
    
    return imageExtensions.some(ext => urlLower.includes(ext)) || 
           imageDomains.some(domain => urlLower.includes(domain))
  }

  // Featured Card Component with Image Handling
  const FeaturedCard = ({ post, index }) => {
    const [currentImage, setCurrentImage] = useState('')
    const [imageLoading, setImageLoading] = useState(true)
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
      if (!post.image || !isValidImageUrl(post.image)) {
        // Use fallback images if original is invalid
        const fallbacks = getFallbackImages(category)
        setCurrentImage(fallbacks[index % fallbacks.length])
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
      }, 4000) // 4 second timeout for original image

      img.onload = () => {
        clearTimeout(loadTimeout)
        // Validate image quality
        if (img.naturalWidth >= 400 && img.naturalHeight >= 200) {
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
        const fallbacks = getFallbackImages(category)
        if (attempt >= fallbacks.length) {
          // All fallbacks failed, use last one anyway
          setCurrentImage(fallbacks[fallbacks.length - 1])
          setImageLoading(false)
          setImageError(true)
          return
        }

        const fallbackImg = new Image()
        const fallbackIndex = (index + attempt) % fallbacks.length
        fallbackImg.src = fallbacks[fallbackIndex]
        
        const fallbackTimeout = setTimeout(() => {
          if (imageLoading) {
            tryFallbackImage(attempt + 1)
          }
        }, 3000)

        fallbackImg.onload = () => {
          clearTimeout(fallbackTimeout)
          setCurrentImage(fallbacks[fallbackIndex])
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
      }
    }, [post.image, category, index])

    const shouldShowImage = currentImage && !imageError

    return (
      <article 
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
            {shouldShowImage ? (
              <>
                {/* Loading skeleton */}
                {imageLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Loading featured image...</div>
                    </div>
                  </div>
                )}
                
                {/* Actual image */}
                <img
                  src={currentImage}
                  alt={post.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    imageLoading ? 'opacity-0' : 'opacity-100 group-hover:scale-110'
                  }`}
                  loading="lazy"
                  decoding="async"
                  importance="high"
                  sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 33vw"}
                  srcSet={`${currentImage}?w=600 600w, ${currentImage}?w=800 800w, ${currentImage}?w=1200 1200w`}
                />
              </>
            ) : (
              // Fallback Image with gradient
              <div 
                className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getFallbackGradient(index)}`}
              >
                <div className="text-center p-6 text-white">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-90" />
                  <div className="text-2xl font-bold mb-2">GlobalNews</div>
                  <div className="text-lg opacity-95 uppercase tracking-wide font-semibold">
                    {category}
                  </div>
                  <div className="text-sm opacity-80 mt-2">Featured Story</div>
                </div>
              </div>
            )}

            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                <TrendingUp className="h-4 w-4" />
                <span>#{index + 1} Trending</span>
              </span>
            </div>

            {/* Quality Indicator */}
            {!imageLoading && !imageError && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow-lg">
                HD
              </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
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
    )
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
          <FeaturedCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* View More Indicator */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
          <span>Showing top {featured.length} featured stories</span>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <span>Scroll down for more news</span>
        </div>
      </div>
    </div>
  )
}