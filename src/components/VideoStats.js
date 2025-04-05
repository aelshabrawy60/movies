import React from 'react';
import CountryFlag from './CountryFlag';

export default function VideoStats({ stats }) {
  return (
    <div className="bg-gray-900 rounded-lg md:p-4 space-y-6 md:border border-gray-800">
      {/* Total Views Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-3">Views List ({stats.views.length} total)</h3>
        <div className="space-y-4">
          {stats.views.map((view) => (
            <div key={view.id} className="bg-gray-800 rounded-lg p-4 space-y-3">
              {/* Location and Watch Info */}
              <div className="flex justify-between items-center">
                <CountryFlag country={view.location} />
                <div className="text-gray-300 text-sm">
                  {new Date(view.watchedAt).toLocaleString()}
                </div>
              </div>

              {/* Watch Duration Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Watch Duration</span>
                  <span className="text-blue-400">
                    {view.watchDuration.timeWatched} / {view.watchDuration.totalDuration}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${view.watchDuration.percentage}%` }}
                  />
                </div>
                <div className="text-right text-sm text-gray-400">
                  {view.watchDuration.percentage}% watched
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
