// app/videos/[id]/actions.js (or a central actions file)
'use server'; // Mark this file exports Server Actions

export async function getVideoWithPassword(videoId, password) {
  // Input validation (basic)
  if (!videoId || !password) {
    return { error: 'Video ID and password are required.' };
  }

  const apiUrl = `https://api.ambientlightfilm.net/api/videos/watch/${videoId}`;

  console.log("password", password)
  try {
    console.log(`Server Action: Fetching access for video ${videoId}`);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ password: password }),
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`Server Action API Error (${response.status}):`, result);
      return { error: result.message || `Access denied or video not found (Status: ${response.status})` };
    }

    if (result.status === 'success' && result.data?.video && result.data?.otp) {
      console.log(`Server Action: Access granted for video ${videoId}`);
      // Construct the complete video object
      const completeVideoData = {
        // Data from API
        id: result.data.video.id,
        title: result.data.video.title,
        description: result.data.video.description,
        video_id: result.data.video.video_id, // Keep original API field name
        created_at: result.data.video.created_at,
        // OTP/Playback Info from API
        otp: result.data.otp.otp,
        playbackInfo: result.data.otp.playbackInfo,
        // --- Mappings & Placeholders (if your VideoPlayer *requires* these exact names) ---
        youtubeId: result.data.video.video_id, // Map youtubeId if VideoPlayer component needs it
        // --- Potentially fill placeholders if needed, or let VideoPlayer handle missing data ---
        creator: "Ambient light", // Placeholder - API doesn't provide this
        views: "N/A",             // Placeholder - API doesn't provide this
        thumbnail: result.data.video.thumbnail, // Placeholder - API doesn't provide this
        duration: "N/A",          // Placeholder - API doesn't provide this
      };
      return { data: completeVideoData }; // Return successful data structure
    } else {
      console.error('Server Action API Error: Invalid success response structure.', result);
      return { error: 'Failed to process video data from API.' };
    }

  } catch (error) {
    console.error('Server Action Fetch Error:', error);
    // Ensure a serializable error object is returned
    return { error: 'An unexpected error occurred while trying to access the video. Please check server logs.' };
  }
}