import Hero from "@/components/Hero";
import MenuButton from "@/components/MenuButton";
import Image from "next/image";

export const revalidate = 3600; // Cache for 1 hour


async function getFeaturedFilms() {
  const res = await fetch('https://api.ambientlightfilm.net/api/films/home-featured', {
    next: { revalidate: 3600 }, // ✅ Enable server caching
  });

  if (!res.ok) return [];

  const json = await res.json();
  if (json.status !== 'success') return [];

  return json.data.map((film) => ({
    id: film.id,
    title: film.title,
    genres: film.genre.split(',').map((g) => g.trim()),
    year: film.release_year,
    fullDescription: film.synopsis,
    director: film.director,
    cast: film.cast.split(',').map((c) => c.trim()),
    duration: film.duration,
    thumbnail: film.image,
  }));
}

export default async  function Home() {
  const featuredFilms = await getFeaturedFilms();

  console.log("featured films", featuredFilms)
  return (
    <div className="overflow-hidden relative">
      <div className="absolute top-5 left-5 w-full h-full">
        <MenuButton/>
      </div>  
      <Hero films={featuredFilms}/>
    </div>
  );
}
