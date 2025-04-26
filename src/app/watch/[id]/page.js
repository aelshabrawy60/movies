// app/videos/[id]/page.jsx (or your equivalent route)
import Footer from '@/components/Footer';
import Navbar from '../../../components/Navbar';
import { VideoContainer } from '@/components/VideoContainer'; // Assuming path is correct
import { getVideoWithPassword } from './actions'; // Import the Server Action


export default async function VideoClipPage({ params }) {
  const videoId = params.id;

  if (!videoId) {
    return <div>Invalid Video ID requested.</div>;
  }

  // Initial, incomplete video object. Only ID is strictly needed by the action.
  // Add any other known details if available without a password.
  const initialVideoData = {
    id: videoId,
    title: "Protected Video", // Placeholder title
    description: "Enter the password to view the description and video.", // Placeholder description
    // Other fields are unknown until password verification
    creator: "",
    views: "",
    youtubeId: "",
    duration: "",
    otp: null, // Explicitly null initially
    playbackInfo: null // Explicitly null initially
  };

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Navbar />
      <main className="w-full sm:px-4 sm:py-6 md:py-8 flex flex-col items-center flex-1">
        <div className="w-full max-w-5xl">
          {/*
            Pass the initial (incomplete) data and the SERVER ACTION
            that VideoContainer's handleSubmit will call.
          */}
          <VideoContainer
            video={initialVideoData}
            getVideoAction={getVideoWithPassword} // Pass the server action as a prop
          />
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}