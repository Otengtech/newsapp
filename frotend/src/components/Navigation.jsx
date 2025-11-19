import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Search, Home, TrendingUp } from "lucide-react";

const categories = [
  { id: "world", name: "World News", icon: "🌍" },
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "entertainment", name: "Entertainment", icon: "🎬" },
  { id: "politics", name: "Politics", icon: "🏛️" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "health", name: "Health", icon: "🏥" }
];

export default function Navigation({ onSearch, activeCategory, onCategoryChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchText.toLowerCase()) ||
    cat.id.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchText.trim()) {
      onSearch(searchText.trim());
      setSearchText("");
      setMobileOpen(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      onSearch(searchText.trim());
      setSearchText("");
      setMobileOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    onSearch("");
  };

  const handleHomeClick = () => {
    clearSearch();
    onCategoryChange(null);
  };

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="w-full bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 group cursor-pointer"
              onClick={handleHomeClick}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NewsHub
              </span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className={`relative flex-1 transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search headlines, topics..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none transition-colors"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchText && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={handleHomeClick}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                  !activeCategory 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Desktop Category Bar */}
          <div className="hidden md:flex items-center space-x-1 px-4 sm:px-6 lg:px-8 py-2 bg-gray-50/80 border-t border-gray-100 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex items-center space-x-2 whitespace-nowrap px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeCategory === category.id
                    ? "bg-white text-blue-600 shadow-sm border border-gray-200 font-semibold"
                    : "text-gray-600 hover:text-blue-600 hover:bg-white/60"
                }`}
              >
                <span className="text-sm">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div 
            ref={mobileMenuRef}
            className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search news..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleSearch}
                />
                {searchText && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearchSubmit}
                disabled={!searchText.trim()}
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Search
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Home Link */}
              <button
                onClick={handleHomeClick}
                className={`flex items-center space-x-3 p-4 border-b border-gray-100 w-full text-left ${
                  !activeCategory 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              {/* Categories */}
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="space-y-1">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left ${
                          activeCategory === category.id
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No categories found</p>
                      <p className="text-sm">Try different keywords</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}