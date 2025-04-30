"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const router = useRouter()

  // Function to get a cookie value by name
  const getCookie = (name) => {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1)
      }
    }
    return null
  }

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email.trim() && !formData.password.trim()) {
      setMessage('Please fill in email or password to make changes.')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Get the auth token from cookies
      const token = getCookie('authToken')
      
      if (!token) {
        setMessage('Authentication error. Please log in again.')
        setMessageType('error')
        router.push('/admin/login')
        return
      }

      // Only include fields that have values
      const updateData = {}
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          updateData[key] = formData[key]
        }
      })

      // Don't send empty password fields
      if (!updateData.password) {
        delete updateData.password
        delete updateData.password_confirmation
      }

      // Check if password and confirmation match
      if (updateData.password && updateData.password !== updateData.password_confirmation) {
        setMessage('Passwords do not match')
        setMessageType('error')
        setIsLoading(false)
        return
      }

      const response = await fetch('https://api.ambientlightfilm.net/api/user/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (data.status === 'success') {
        setMessage(data.message || 'Profile updated successfully')
        setMessageType('success')
        // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          password: '',
          password_confirmation: ''
        }))
      } else {
        setMessage(data.message || 'Failed to update profile')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('An error occurred. Please try again.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex text-gray-100 items-center min-h-screen">
        <div className="flex-1 p-8">
          <div className="max-w-sm mx-auto border border-gray-700 bg-gray-900 p-6 rounded-lg shadow-lg">            
            {message && (
              <div className={`p-4 mb-6 rounded ${
                messageType === 'success' 
                  ? 'bg-green-900 text-green-100 border border-green-700' 
                  : 'bg-red-900 text-red-100 border border-red-700'
              }`}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className=' border-gray-700'>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  New Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsPage