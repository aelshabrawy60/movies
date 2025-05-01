import React from 'react';
import CountryFlag from './CountryFlag';

export default function VideoStats({ stats }) {
  if (!stats || !stats.views || stats.views.length === 0) {
    return <div className="text-gray-400">No statistics available for this video.</div>;
  }

  return (
    <div className="bg-gray-900 rounded-lg md:p-4 space-y-6 md:border border-gray-800">
      {/* Total Views Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-3">Views List ({stats.total_views} total)</h3>
        <div className="space-y-4">
          {stats.views.map((view, index) => {
            // Extract percentage as a number from the string "80% watched"
            const percentageMatch = view.percent?.match(/(\d+)%/);
            const percentage = percentageMatch ? parseInt(percentageMatch[1]) : 0;
            
            return (
              <div key={index} className="bg-gray-800 rounded-lg p-4 space-y-3">
                {/* Location and Watch Info */}
                <div className="flex justify-between items-center">
                  <CountryFlag country={view.country || 'Unknown'} />
                  <div className="text-gray-300 text-sm">
                    {formatUTCToLocal(view.date)}
                  </div>
                </div>

                {/* Watch Duration Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Watch Duration</span>
                    <span className="text-blue-400">
                      {view.duration_watched} / {view.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    {view.percent}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatUTCToLocal(dateStr) {
  // Parse the string as if it's in GMT+0
  const [datePart, timePart, modifier] = dateStr.match(/(\d+\/\d+\/\d+), (\d+:\d+:\d+) (AM|PM)/).slice(1);
  const [month, day, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  
  let hour = hours;
  if (modifier === 'PM' && hour !== 12) hour += 12;
  if (modifier === 'AM' && hour === 12) hour = 0;

  // Create a UTC date
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minutes, seconds));
  
  // Convert to local string
  return utcDate.toLocaleString();
}
