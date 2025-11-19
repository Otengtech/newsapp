import React from "react";

export const Navigation = ({
  categories,
  activeCategory,
  setActiveCategory,
  subreddits
}) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="
            flex 
            space-x-4 sm:space-x-6 md:space-x-10 
            overflow-x-auto 
            py-3 md:py-4 
            scrollbar-hide 
            no-scrollbar
          "
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-3 sm:px-4 md:px-5 
                py-2 
                whitespace-nowrap 
                rounded-lg 
                text-sm sm:text-base 
                font-medium 
                transition-all duration-200
                ${
                  activeCategory === category
                    ? "text-primary-700 border-b-2 border-primary-600"
                    : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                }
              `}
            >
              {subreddits[category].name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
