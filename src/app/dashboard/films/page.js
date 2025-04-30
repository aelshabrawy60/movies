"use client"
import { useState, useEffect } from 'react';
import AddFilmButton from '@/components/AddFilmButton';
import FilmCard from '@/components/FilmCard';
import Cookies from 'js-cookie';
import EditFilmModal from '@/components/EditFilmModal';

function DashboardPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const authToken = Cookies.get('authToken');
      
      if (!authToken) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.ambientlightfilm.net/api/films', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching films: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('Fetched films:', result.data); // Debugging line
      if (result.status === 'success' && Array.isArray(result.data)) {
        setFilms(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to fetch films:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFilm = (film) => {
    setSelectedFilm(film);
    setIsEditModalOpen(true);
  };

  const handleDeleteFilm = async (filmId) => {
    if (window.confirm('Are you sure you want to delete this film?')) {
      try {
        const authToken = Cookies.get('authToken');
        
        const response = await fetch(`https://api.ambientlightfilm.net/api/films/${filmId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error deleting film: ${response.status}`);
        }

        // Refresh the films list after deletion
        fetchFilms();
      } catch (err) {
        console.error('Failed to delete film:', err);
        alert(`Failed to delete film: ${err.message}`);
      }
    }
  };

  const handleSaveFilm = async () => {
    try {
      // Close the modal
      setIsEditModalOpen(false);
      
      // Refresh the films list
      fetchFilms();
    } catch (err) {
      console.error('Failed to update film:', err);
      alert(`Failed to update film: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Error loading films: {error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className='px-4 sm:px-8 pb-8 sm:pb-16 pt-8'>
        {/* Films Grid */}
        <div className='flex justify-end md:justify-start'>
          <AddFilmButton />
        </div>
        <div className="grid mt-6 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {films.length > 0 ? (
            films.map((film) => (
              <FilmCard 
                key={film.id} 
                film={film} 
                isEditable={true} 
                onEdit={handleEditFilm}
                onDelete={handleDeleteFilm}
              />
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">No films available</p>
          )}
        </div>

        <EditFilmModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          film={selectedFilm}
          onSave={handleSaveFilm}
        />
      </div>
    </>
  );
}

export default DashboardPage;