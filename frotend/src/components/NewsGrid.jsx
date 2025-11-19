import React from 'react'
import { NewsCard } from './NewsCard'

export const NewsGrid = ({ news, category, borderColor }) => {
  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No news found matching your criteria</div>
        <div className="text-gray-500 text-sm mt-2">Try adjusting your search or browse different categories</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {news.map((post, index) => (
        <NewsCard 
          key={post.id} 
          post={post} 
          category={category}
          borderColor={borderColor}
          index={index}
        />
      ))}
    </div>
  )
}