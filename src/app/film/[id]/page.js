import { notFound } from 'next/navigation';
import FilmDetails from '@/components/FilmDetails';

export const dynamic = 'force-static'; // or use `export const revalidate = 3600;` for ISR (1hr)

async function getFilm(id) {
  const res = await fetch(`https://api.ambientlightfilm.net/api/films/${id}`, {
    // Caches on the server by default (force-static) or enable revalidate
    next: { revalidate: 3600 }, // 1 hour
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  if (data.status !== 'success') {
    return null;
  }

  return {
    id: data.data.id,
    title: data.data.title,
    genres: data.data.genre.split(',').map((g) => g.trim()),
    year: data.data.release_year,
    fullDescription: data.data.synopsis,
    director: data.data.director,
    cast: data.data.cast.split(',').map((c) => c.trim()),
    duration: data.data.duration,
    thumbnail: data.data.image,
  };
}

export default async function FilmPage({ params }) {
  const film = await getFilm(params.id);

  if (!film) return notFound();
  return <FilmDetails film={film} />;
}
