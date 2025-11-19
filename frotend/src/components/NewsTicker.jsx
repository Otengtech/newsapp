import React, { useState, useEffect } from 'react'
import { AlertCircle, ChevronRight } from 'lucide-react'

export const NewsTicker = ({ news }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (news.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(news.length, 5))
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [news])

  if (!news || news.length === 0) return null

  const breakingNews = news.slice(0, 5) // Top 5 as breaking news

  return (
    <div className="bg-primary-600 text-white py-3 mb-8 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-600 text-gray-100 px-3 py-1 rounded-full">
            <AlertCircle className="h-4 w-4" />
            <span className="font-bold text-sm">BREAKING</span>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div 
              className="whitespace-nowrap transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {breakingNews.map((post, index) => (
                <div 
                  key={post.id} 
                  className="inline-block w-full"
                  style={{ transform: `translateX(${index * 100}%)` }}
                >
                  <div className="flex items-center space-x-4">
                    <ChevronRight className="h-4 w-4 text-gray-700 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium truncate">
                      {post.title}
                    </span>
                    <span className="text-xs text-primary-200 bg-primary-700 px-2 py-1 rounded">
                      Live
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex space-x-1">
            {breakingNews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-primary-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}