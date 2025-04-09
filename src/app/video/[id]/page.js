// VideoClipPage.jsx (Server Component)
import Footer from '@/components/Footer';
import Navbar from '../../../components/Navbar';
import { VideoContainer } from '@/components/VideoContainer';

const video = {
    id: 5,
    title: "Trianto appelomng termanati",
    creator: "Fight Club",
    views: "1.3M",
    thumbnail: "/arze.webp",
    youtubeId: "chyRpj-971o", 
    duration: "4:05",
    description: "Experience the tranquil sounds of rain falling in a dense forest. Perfect for relaxation, meditation, or as a soothing background while you work or study. Recorded in the pristine wilderness of the Pacific Northwest."
}

// Password validation function (server-side)
async function verifyPassword(password) {
  'use server'
  // Replace with your actual password
  const correctPassword = '123';
  return password === correctPassword;
}

export default function VideoClipPage() {
  return (
    <div className="min-h-screen flex flex-col text-white">
      <Navbar/>
      <main className="w-full sm:px-4 sm:py-6 md:py-8 flex flex-col items-center flex-1">
        <div className="w-full max-w-5xl">
          <VideoContainer video={video} verifyPassword={verifyPassword} />
        </div>
      </main>
    </div>
  );
}