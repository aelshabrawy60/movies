import { headers } from 'next/headers'; // Add this import



// app/api/track-video-time/route.js
export async function POST(request) {
    try {
      // Get client IP address
      const ip = headers().get('x-forwarded-for') || '0.0.0.0'
      
      // Parse the tracking data sent from client
      const { videoId, totalPlayed, totalCovered } = await request.json();
      
      // Log the data for testing
      console.log('Video watch data received:', {
        timestamp: new Date().toISOString(),
        ip,
        videoId,
        totalPlayed,
        totalCovered
      });
      
      try {
        const response = await fetch('https://api.ambientlightfilm.net/api/videos/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            video_id: videoId,
            ip: ip, 
            watched_duration: totalCovered,
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        console.log("Tracking data sent:", {
          video_id: videoId,
          ip: ip, 
          watched_duration: totalCovered
        });
      } catch (error) {
        console.error("Failed to send tracking data:", error);
      }
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "Video tracking data saved successfully"
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error processing video tracking:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }