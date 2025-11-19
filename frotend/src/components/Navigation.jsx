import React from 'react'

export const Navigation = ({ categories, activeCategory, setActiveCategory, subreddits }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-10 overflow-x-auto py-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap pb-2 font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-primary-600 text-gray-800 border-b border-b-gray-600'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              {subreddits[category].name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}