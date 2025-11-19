import React, { useEffect, useRef, useState } from 'react'
import { Users, MessageSquare, TrendingUp, Eye, Award, Calendar, BarChart3, Zap } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

// Animated Progress Bar Component
const AnimatedProgressBar = ({ gradient, width, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [inView, delay])

  return (
    <div ref={ref} className="mt-3">
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
          style={{ 
            width: isVisible ? `${width}%` : '0%',
            transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left'
          }}
        ></div>
      </div>
    </div>
  )
}

// Individual Stat Card Component
const StatCard = ({ stat, index, totalStats }) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  // Calculate progress width based on index (for visual appeal)
  const progressWidth = Math.min((index + 1) * (100 / totalStats), 100)

  return (
    <div 
      ref={ref}
      className={`group relative bg-white rounded-2xl shadow-lg border border-gray-200 p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        inView ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background Gradient Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${stat.bgColor}`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          <div className="text-right">
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.label}</div>
        
        {/* Animated Progress Bar */}
        <AnimatedProgressBar 
          gradient={stat.gradient} 
          width={progressWidth}
          delay={index * 150 + 300}
        />
      </div>
    </div>
  )
}

export const CategoryStats = ({ news, category }) => {
  if (!news || news.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl border border-blue-200 p-8 mb-8">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Data Available</h3>
          <p className="text-gray-500">Start browsing to see category insights</p>
        </div>
      </div>
    )
  }

  const totalUpvotes = news.reduce((sum, post) => sum + post.score, 0)
  const totalComments = news.reduce((sum, post) => sum + post.comments, 0)
  const averageUpvotes = Math.round(totalUpvotes / news.length)
  const averageComments = Math.round(totalComments / news.length)
  const mostPopular = news.reduce((max, post) => post.score > max.score ? post : max, news[0])
  
  // Calculate engagement rate
  const engagementRate = ((averageUpvotes + averageComments) / 100).toFixed(1)

  const stats = [
    {
      icon: Users,
      label: 'Total Stories',
      value: news.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'Total Upvotes',
      value: totalUpvotes.toLocaleString(),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: MessageSquare,
      label: 'Total Comments',
      value: totalComments.toLocaleString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      label: 'Engagement Rate',
      value: `${engagementRate}x`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      gradient: 'from-orange-500 to-orange-600'
    }
  ]

  // Add CSS for animations (you can also put this in your global CSS)
  const animationStyles = `
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.6s ease-out forwards;
    }
  `

  return (
    <>
      <style>{animationStyles}</style>
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-blue-200 p-6 md:p-8 mb-8 transition-all duration-500 hover:shadow-2xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
          <div className="flex-1 mb-6 lg:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {category ? `${category} Insights` : 'Global News Dashboard'}
                </h1>
                <p className="text-gray-600 mt-2 text-sm md:text-base">
                  Real-time analytics and trending stories from across the web
                </p>
              </div>
            </div>
            
            {/* Quick Stats Bar */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-200">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-200">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{totalUpvotes.toLocaleString()} engagements</span>
              </div>
            </div>
          </div>
          
          {/* Category Badge */}
          {category && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg">
              <div className="text-center">
                <div className="text-lg font-bold capitalize">{category}</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              stat={stat}
              index={index}
              totalStats={stats.length}
            />
          ))}
        </div>

        {/* Most Popular Post - Hero Section */}
        {mostPopular && (
          <div className="bg-gradient-to-r from-blue-500 hidden md:block to-purple-600 rounded-2xl shadow-2xl p-6 md:p-8 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-400 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-800" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold">Trending Story</h3>
                    <p className="text-blue-100 text-sm">Most engaged content in this category</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg md:text-xl font-semibold leading-relaxed">
                    {mostPopular.title}
                  </h4>
                  
                  {mostPopular.author && (
                    <div className="flex items-center gap-2 text-blue-100">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">by {mostPopular.author}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Engagement Metrics */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 min-w-[200px]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white mb-1">
                      <TrendingUp className="h-5 w-5" />
                      {mostPopular.score.toLocaleString()}
                    </div>
                    <div className="text-blue-100 text-xs font-medium uppercase tracking-wide">Upvotes</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white mb-1">
                      <MessageSquare className="h-5 w-5" />
                      {mostPopular.comments.toLocaleString()}
                    </div>
                    <div className="text-blue-100 text-xs font-medium uppercase tracking-wide">Comments</div>
                  </div>
                </div>
                
                {/* Engagement Score */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {((mostPopular.score + mostPopular.comments) / 1000).toFixed(1)}K
                    </div>
                    <div className="text-blue-100 text-xs">Total Engagement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Eye className="h-4 w-4" />
            <span>Updated in real-time • Powered by community engagement</span>
          </div>
        </div>
      </div>
    </>
  )
}