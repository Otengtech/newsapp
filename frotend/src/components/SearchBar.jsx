import React from 'react'
import { Search } from 'lucide-react'

export const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="hidden md:block relative w-80">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search news..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>
  )
}