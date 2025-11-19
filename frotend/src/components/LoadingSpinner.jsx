import React from 'react'
import { Loader } from 'lucide-react'

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader className="h-12 w-12 text-primary-600 animate-spin mb-4" />
      <div className="text-gray-600">Loading latest news...</div>
      <div className="text-sm text-gray-500 mt-2">Fetching real-time updates from Reddit</div>
    </div>
  )
}