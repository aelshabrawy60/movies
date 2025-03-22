import VideoCard from "./VideoCard";

// components/VideoGrid.js
export default function VideoGrid({ onVideoSelect }) {
    // Mock data - in a real app, this would come from an API
    const videos = [
      { id: 2, creator: "Fight Club" , title: 'Tailwind CSS Tutorial', views: 3456, duration: '12:45', thumbnail: '/11-Fight-Club-MSDFICL_EC006-H-2023.jpg' },
      { id: 3, title: 'React Hooks Explained', views: 2100, likes: 143, duration: '8:15', thumbnail: '/arze-main.webp' },
      { id: 4, title: 'Build a Dashboard UI', views: 1876, likes: 120, duration: '15:20', thumbnail: '/show1.jpg' },
      { id: 5, title: 'API Integration Best Practices', views: 980, likes: 65, duration: '10:10', thumbnail: '/490731.jpg' },
      { id: 7, title: 'React Hooks Explained', views: 2100, likes: 143, duration: '8:15', thumbnail: '/arze-main.webp' },
      { id: 6, creator: "Fight Club" , title: 'Tailwind CSS Tutorial', views: 3456, duration: '12:45', thumbnail: '/11-Fight-Club-MSDFICL_EC006-H-2023.jpg' },
      { id: 9, title: 'API Integration Best Practices', views: 980, likes: 65, duration: '10:10', thumbnail: '/490731.jpg' },
      { id: 8, title: 'Build a Dashboard UI', views: 1876, likes: 120, duration: '15:20', thumbnail: '/show1.jpg' },

    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map(video => (
          <VideoCard key={video.id} videoData={video}/>
        ))}
      </div>
    );
  }