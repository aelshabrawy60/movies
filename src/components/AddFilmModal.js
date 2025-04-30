import React, { useState } from 'react';
import Modal from './Modal'; // Assuming Modal component is in the same directory

export default function AddFilmModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    release_year: new Date().getFullYear().toString(),
    synopsis: '',
    director: '',
    cast: '',
    duration: '',
    image: null,
    featured: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [xhrRequest, setXhrRequest] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const resetFormState = () => {
    setFormData({
      title: '',
      genre: '',
      release_year: new Date().getFullYear().toString(),
      synopsis: '',
      director: '',
      cast: '',
      duration: '',
      image: null,
      featured: false
    });
    setIsLoading(false);
    setProgress(0);
    setResult(null);
    setError(null);
    setXhrRequest(null);
    setIsCopied(false);
    const fileInput = document.querySelector('input[name="image"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleClose = () => {
    if (isLoading && xhrRequest) {
      xhrRequest.abort();
      console.log('Film creation cancelled by user.');
    }
    resetFormState();
    onClose();
  };

  const handleChange = async (e) => {
    const { name, value, files, type, checked } = e.target;
  
    if (name === 'image' && files && files[0]) {
      try {
        const compressedImage = await compressAndConvertImage(files[0]);
        setFormData(prev => ({
          ...prev,
          [name]: compressedImage
        }));
      } catch (error) {
        console.error('Image compression failed:', error);
        setFormData(prev => ({
          ...prev,
          [name]: files[0] // fallback to original
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    const requiredFields = ['title', 'genre', 'release_year', 'synopsis', 'director', 'cast', 'duration', 'image'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);
    setResult(null);

    try {
      const authToken = getCookie('authToken');
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const apiFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          apiFormData.append(key, value);
        }
      });

      const xhr = new XMLHttpRequest();
      setXhrRequest(xhr);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        setXhrRequest(null);
        if (xhr.status >= 200 && xhr.status < 300) {
          const result = JSON.parse(xhr.responseText);
          setResult(result);
          setIsLoading(false);
          setProgress(100);
        } else {
          let errorMsg = 'Failed to create film';
          try {
            const result = JSON.parse(xhr.responseText);
            errorMsg = result?.errors?.detail || result?.message || `Server error: ${xhr.status}`;
          } catch (parseError) {
            errorMsg = `Server error: ${xhr.status} - ${xhr.statusText}`;
          }
          setError(errorMsg);
          setIsLoading(false);
          setProgress(0);
        }
      });

      xhr.addEventListener('error', () => {
        setXhrRequest(null);
        console.error('Creation error (network or CORS):', xhr.statusText);
        setError('Film creation failed due to a network error or configuration issue.');
        setIsLoading(false);
        setProgress(0);
      });

      xhr.addEventListener('abort', () => {
        setXhrRequest(null);
        console.log('Film creation aborted.');
        setIsLoading(false);
        setProgress(0);
      });

      xhr.open('POST', 'https://api.ambientlightfilm.net/api/films', true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      xhr.send(apiFormData);

    } catch (err) {
      console.error('Film creation setup error:', err);
      setError(err.message || 'An unexpected error occurred before creating the film.');
      setIsLoading(false);
      setProgress(0);
      setXhrRequest(null);
    }
  };

  const handleCopyImageUrl = () => {
    if (!result?.data?.image_url) return;

    navigator.clipboard.writeText(result.data.image_url)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy image URL: ', err);
        setError('Failed to copy image URL. Please try again.');
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {result ? 'Film Added Successfully' : 'Add New Film'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success View */}
        {result && !error && (
          <div className="bg-opacity-25 rounded-md space-y-4">
            <div>
              <p className="text-blue-200 text-sm">The film "{result.data?.title || 'film'}" has been added successfully.</p>
            </div>

            {result.data?.image_url && (
              <div>
                <div className="mb-3">
                  <img 
                    src={result.data.image_url} 
                    alt={result.data.title}
                    className="max-h-40 rounded-md object-cover"
                  />
                </div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Film Image URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={result.data.image_url}
                    readOnly
                    className="flex-grow bg-gray-900 border border-gray-700 text-gray-400 px-3 py-2 rounded-md focus:outline-none text-sm"
                    aria-label="Film Image URL"
                  />
                  <button
                    type="button"
                    onClick={handleCopyImageUrl}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center justify-center min-w-[70px] ${
                      isCopied
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                    }`}
                    aria-live="polite"
                  >
                    {isCopied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Error View */}
        {error && !result && (
          <div className="bg-red-800 bg-opacity-25 border border-red-700 rounded-md p-4 mb-4 space-y-3">
            <h3 className="text-red-400 font-semibold">Film Creation Failed</h3>
            <p className="text-red-200 text-sm">{error}</p>
            <div className="flex justify-end">
              <button
                onClick={() => {setError(null); setProgress(0); setIsLoading(false);}}
                className="rounded-md bg-gray-700 px-3 py-1 text-sm font-medium text-gray-200 hover:bg-gray-600"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Film Creation Form */}
        {!result && !error && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="titleInput">
                Title *
              </label>
              <input
                id="titleInput"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
                required
                disabled={isLoading}
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="genreInput">
                Genre *
              </label>
              <input
                id="genreInput"
                type="text"
                name="genre"
                placeholder="Comedy, Drama, Thriller, etc."
                value={formData.genre}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
                required
                disabled={isLoading}
              />
            </div>

            {/* Release Year */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="yearInput">
                Release Year *
              </label>
              <input
                id="yearInput"
                type="number"
                name="release_year"
                min="1900"
                max="2100"
                value={formData.release_year}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
                required
                disabled={isLoading}
              />
            </div>

            {/* Synopsis */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="synopsisInput">
                Synopsis *
              </label>
              <textarea
                id="synopsisInput"
                name="synopsis"
                value={formData.synopsis}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
                required
                disabled={isLoading}
              />
            </div>

            {/* Director */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="directorInput">
                Director *
              </label>
              <input
                id="directorInput"
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
                required
                disabled={isLoading}
              />
            </div>

            {/* Cast */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="castInput">
                Cast *
              </label>
              <input
                id="castInput"
                type="text"
                name="cast"
                placeholder="Actor 1, Actor 2, Actor 3"
                value={formData.cast}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
                required
                disabled={isLoading}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="durationInput">
                Duration (minutes) *
              </label>
              <input
                id="durationInput"
                type="number"
                name="duration"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
                required
                disabled={isLoading}
              />
            </div>

            {/* Film Poster Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="imageInput">
                Film Poster Image *
              </label>
              <input
                id="imageInput"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-800 file:text-blue-400
                  hover:file:bg-gray-700 cursor-pointer
                  bg-gray-800 border border-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={isLoading}
              />
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center">
              <input
                id="featuredCheckbox"
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 bg-gray-800 border-gray-600 disabled:opacity-50"
                disabled={isLoading}
              />
              <label htmlFor="featuredCheckbox" className="ml-2 block text-sm text-gray-300">
                Featured Film
              </label>
            </div>

            {/* Progress Indicator */}
            {isLoading && (
              <div className="pt-2">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-150 ease-linear"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <p className="text-center text-xs text-gray-300 mt-1">{progress}% Complete</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-gray-700"
              >
                {isLoading ? 'Cancel' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.title || !formData.genre || !formData.synopsis || !formData.director || !formData.cast || !formData.duration || !formData.image}
                className="min-w-[90px] rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Film'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}



const compressAndConvertImage = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed.'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = (err) => {
        reject(err);
      };
    };

    reader.onerror = (err) => {
      reject(err);
    };
  });
};
