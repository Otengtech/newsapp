import React from 'react'
import { Users, MessageSquare, TrendingUp, Eye, Award } from 'lucide-react'

export const CategoryStats = ({ news, category }) => {
  if (!news || news.length === 0) return null

  const totalUpvotes = news.reduce((sum, post) => sum + post.score, 0)
  const totalComments = news.reduce((sum, post) => sum + post.comments, 0)
  const averageUpvotes = Math.round(totalUpvotes / news.length)
  const averageComments = Math.round(totalComments / news.length)
  const mostPopular = news.reduce((max, post) => post.score > max.score ? post : max, news[0])

  const stats = [
    {
      icon: Users,
      label: 'Total Stories',
      value: news.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: TrendingUp,
      label: 'Total Upvotes',
      value: totalUpvotes.toLocaleString(),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: MessageSquare,
      label: 'Total Comments',
      value: totalComments.toLocaleString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: Eye,
      label: 'Avg Engagement',
      value: `${averageUpvotes}↑ / ${averageComments}💬`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Category Insights</h3>
          <p className="text-sm text-gray-500 mt-1">
            Analytics for <span className="font-semibold text-blue-600">{category || 'all categories'}</span>
          </p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`text-center p-5 rounded-xl border-2 ${stat.bgColor} ${stat.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-md`}
          >
            <div className={`p-2 rounded-lg ${stat.bgColor} w-12 h-12 mx-auto mb-3 flex items-center justify-center`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Most Popular Post */}
      {mostPopular && (
        <div className="border-t border-gray-100 pt-6">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Most Popular Story</h4>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-relaxed">
                  {mostPopular.title}
                </p>
                {mostPopular.author && (
                  <p className="text-xs text-gray-500 mt-2">
                    by <span className="font-medium text-gray-700">{mostPopular.author}</span>
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    {mostPopular.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Upvotes</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center gap-1 text-lg font-bold text-purple-600">
                    <MessageSquare className="h-4 w-4" />
                    {mostPopular.comments}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Comments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}