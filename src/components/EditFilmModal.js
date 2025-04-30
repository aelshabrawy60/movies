import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Assuming Modal component is in the same directory

export default function EditFilmModal({ isOpen, onClose, film, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    release_year: '',
    synopsis: '',
    director: '',
    cast: '',
    duration: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [xhrRequest, setXhrRequest] = useState(null);

  // Update form data when film changes
  useEffect(() => {
    if (film) {
      setFormData({
        title: film.title || '',
        genre: film.genre || '',
        release_year: film.release_year || '',
        synopsis: film.synopsis || '',
        director: film.director || '',
        cast: film.cast || '',
        duration: timeStringToMinutes(film.duration) || '',
        featured: film.featured || false
      });
      
      // If film has an image URL, set it as preview
      if (film.image) {
        setPreviewUrl(film.image);
      } else {
        setPreviewUrl('');
      }
    } else {
      // Reset form if no film is provided
      setFormData({
        title: '',
        genre: '',
        release_year: '',
        synopsis: '',
        director: '',
        cast: '',
        duration: '',
        featured: false
      });
      setPreviewUrl('');
    }
    // Reset image file and progress on film change
    setImageFile(null);
    setProgress(0);
  }, [film]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Compress and convert image to WebP
        const compressedImage = await compressAndConvertImage(file);
        setImageFile(compressedImage);
        
        // Create a preview URL for the selected image
        const objectUrl = URL.createObjectURL(compressedImage);
        setPreviewUrl(objectUrl);
        
        // Clean up the URL when component unmounts or when file changes
        return () => URL.revokeObjectURL(objectUrl);
      } catch (error) {
        console.error('Image compression failed:', error);
        // Fallback to original file if compression fails
        setImageFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    setLoading(true);
    setError(null);
    setProgress(0);
  
    try {
      const authToken = getCookie('authToken');
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
  
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('release_year', formData.release_year);
      formDataToSend.append('synopsis', formData.synopsis);
      formDataToSend.append('director', formData.director);
      formDataToSend.append('cast', formData.cast);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('featured', formData.featured.toString());
  
      if (imageFile) {
        formDataToSend.append('image', imageFile); // Attach image file
      }
  
      const filmId = film.id;
  
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
          onSave(result.data);
          setLoading(false);
          setProgress(100);
          onClose();
        } else {
          let errorMsg = 'Failed to update film';
          try {
            const result = JSON.parse(xhr.responseText);
            errorMsg = result?.errors?.detail || result?.message || `Server error: ${xhr.status}`;
          } catch (parseError) {
            errorMsg = `Server error: ${xhr.status} - ${xhr.statusText}`;
          }
          setError(errorMsg);
          setLoading(false);
          setProgress(0);
        }
      });
  
      xhr.addEventListener('error', () => {
        setXhrRequest(null);
        console.error('Update error (network or CORS):', xhr.statusText);
        setError('Film update failed due to a network error or configuration issue.');
        setLoading(false);
        setProgress(0);
      });
  
      xhr.addEventListener('abort', () => {
        setXhrRequest(null);
        console.log('Film update aborted.');
        setLoading(false);
        setProgress(0);
      });
  
      xhr.open('POST', `https://api.ambientlightfilm.net/api/films/${filmId}`, true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      // Do NOT set 'Content-Type' here; the browser sets it correctly for multipart/form-data
      xhr.send(formDataToSend);
  
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
      setProgress(0);
      setXhrRequest(null);
    }
  };
  
  
  
  

  const handleClose = () => {
    if (loading && xhrRequest) {
      xhrRequest.abort();
      console.log('Film update cancelled by user.');
    }
    onClose();
  };

  const getCookie = (name) => {
    if (typeof document === 'undefined') return null; // Guard against SSR
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Film</h2>
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

        {error && (
          <div className="bg-red-900 text-white p-3 rounded-md text-sm break-words">
            Error: {error}
          </div>
        )}

        {/* Progress Indicator */}
        {loading && (
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

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="titleInput">
              Film Title
            </label>
            <input
              id="titleInput"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="genreInput">
              Genre
            </label>
            <input
              id="genreInput"
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="e.g. Comedy, Drama, Action"
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          {/* Release Year and Duration - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="releaseYearInput">
                Release Year
              </label>
              <input
                id="releaseYearInput"
                type="number"
                name="release_year"
                value={formData.release_year}
                onChange={handleChange}
                min="1900"
                max="2100"
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="durationInput">
                Duration (minutes)
              </label>
              <input
                id="durationInput"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Director */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="directorInput">
              Director
            </label>
            <input
              id="directorInput"
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          {/* Cast */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="castInput">
              Cast
            </label>
            <input
              id="castInput"
              type="text"
              name="cast"
              value={formData.cast}
              onChange={handleChange}
              placeholder="e.g. Actor 1, Actor 2, Actor 3"
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="synopsisInput">
              Synopsis
            </label>
            <textarea
              id="synopsisInput"
              name="synopsis"
              value={formData.synopsis}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          {/* Film Poster Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Film Poster
            </label>
            <div className="flex items-start space-x-4">
              {/* Image Preview */}
              {previewUrl && (
                <div className="relative w-24 h-32 bg-gray-700 rounded-md overflow-hidden">
                  <img 
                    src={previewUrl}
                    alt="Film poster preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Upload input */}
              <div className="flex-grow">
                <label className="block w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-md cursor-pointer hover:bg-gray-600 transition-colors text-center">
                  <span className="text-sm">Choose new image</span>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    disabled={loading}
                  />
                </label>
                <p className="text-xs text-gray-400 mt-1">Leave empty to keep current image</p>
              </div>
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center">
            <input
              id="featuredCheckbox"
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 bg-gray-800 border-gray-600 rounded text-blue-600 focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="featuredCheckbox" className="ml-2 block text-sm text-gray-300">
              Featured Film
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 border border-gray-700 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center min-w-[130px] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function timeStringToMinutes(timeStr) {
  if (!timeStr) return '';
  
  const hoursMatch = timeStr.match(/(\d+)\s*h/);
  const minutesMatch = timeStr.match(/(\d+)\s*m/);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

  return hours * 60 + minutes;
}

// Image compression function
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