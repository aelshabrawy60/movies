// PasswordForm.jsx (Client Component)
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PasswordForm({ verifyPassword }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('password', password);
    
    const result = await verifyPassword(formData);
    
    if (result.success) {
      router.refresh(); // Refresh the page to show video
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className=" p-8 rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Protected Video</h2>
      <p className="mb-6 text-gray-300 text-center">
        Please enter the password to access this video.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>
        
        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 disabled:opacity-70"
        >
          {isLoading ? 'Verifying...' : 'Access Video'}
        </button>
      </form>
    </div>
  );
}