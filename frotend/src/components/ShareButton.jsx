import React, { useState } from 'react'
import { Share2, Twitter, Facebook, Link2, Check } from 'lucide-react'

export const ShareButton = ({ post }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareData = {
    title: post.title,
    url: post.url
  }

  const handleShare = async (platform) => {
    const text = `Check out this news: ${post.title}`
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(post.url)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.url)}`, '_blank')
        break
      case 'copy':
        await navigator.clipboard.writeText(post.url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
      default:
        if (navigator.share) {
          navigator.share(shareData)
        }
    }
    
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Twitter className="h-4 w-4 text-blue-400" />
              <span>Share on Twitter</span>
            </button>
            
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              <span>Share on Facebook</span>
            </button>
            
            <button
              onClick={() => handleShare('copy')}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Link2 className="h-4 w-4 text-gray-500" />
              )}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}