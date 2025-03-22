// components/VideoStats.js
export default function VideoStats({ video, onBack }) {
    // Extended statistics that would normally come from an API
    const extendedStats = {
      published: '2023-10-15',
      engagement: '78%',
      comments: 43,
      shares: 28,
      averageWatchTime: '4:21',
      demographics: {
        age: { '18-24': 35, '25-34': 42, '35-44': 15, '45+': 8 },
        gender: { male: 65, female: 32, other: 3 }
      }
    };
  
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        <div className="relative pb-[56.25%] bg-gray-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-20 w-20 text-white opacity-70" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="p-5">
          <button 
            onClick={onBack}
            className="mb-4 flex items-center text-blue-400 hover:text-blue-300"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to dashboard
          </button>
          
          <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Performance Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Views</span>
                  <span className="font-medium">{video.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Likes</span>
                  <span className="font-medium">{video.likes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Comments</span>
                  <span className="font-medium">{extendedStats.comments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shares</span>
                  <span className="font-medium">{extendedStats.shares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Engagement Rate</span>
                  <span className="font-medium">{extendedStats.engagement}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Viewer Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg. Watch Time</span>
                  <span className="font-medium">{extendedStats.averageWatchTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Published</span>
                  <span className="font-medium">{extendedStats.published}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="font-medium">{video.duration}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Demographics</h3>
            <div className="space-y-5">
              <div>
                <h4 className="text-gray-400 mb-2">Age Distribution</h4>
                <div className="flex items-end h-24 space-x-2">
                  {Object.entries(extendedStats.demographics.age).map(([range, percentage]) => (
                    <div key={range} className="relative flex-1 group">
                      <div className="absolute inset-x-0 bottom-0 bg-blue-500 rounded-t" style={{ height: `${percentage}%` }}></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {percentage}%
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 text-xs mt-1 text-gray-400">{range}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }