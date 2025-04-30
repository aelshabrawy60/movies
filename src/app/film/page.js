import FilmCard from '@/components/FilmCard';
import MenuButton from '@/components/MenuButton';
import AnimatedTitle from '@/components/AnimatedTitle'; // NEW client component

export const dynamic = 'force-static';

export default async function FilmsPage() {
  let films = [];
  let error = null;

  try {
    const res = await fetch('https://api.ambientlightfilm.net/api/films', {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error('Failed to fetch films');

    const result = await res.json();

    if (result.status === 'success' && result.data) {
      films = result.data.map((film) => ({
        ...film,
        thumbnail: film.image,
      }));
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (err) {
    error = err.message;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-5 left-5 z-50">
        <MenuButton />
      </div>

      <AnimatedTitle />

      <div className="px-4 sm:px-8 pb-8 sm:pb-16">
        {error ? (
          <div className="text-red-500 text-center py-10">Error: {error}</div>
        ) : films.length === 0 ? (
          <div className="text-white text-center py-10">No films available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {films.map((film, index) => (
              <FilmCard key={film.id} film={film}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
