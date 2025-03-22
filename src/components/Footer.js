import React from 'react'

function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="py-8 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-4">© 2025 Ambientlight. All rights reserved.</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer