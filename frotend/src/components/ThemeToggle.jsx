import React, { useState, useEffect } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

export const ThemeToggle = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.className = savedTheme
  }, [])

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor }
  ]

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      document.documentElement.className = systemTheme
    } else {
      document.documentElement.className = newTheme
    }
  }

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {themes.map((themeOption) => {
        const Icon = themeOption.icon
        return (
          <button
            key={themeOption.id}
            onClick={() => handleThemeChange(themeOption.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              theme === themeOption.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{themeOption.name}</span>
          </button>
        )
      })}
    </div>
  )
}