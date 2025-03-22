import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <>
        {/* Navigation */}
        <nav className="px-6 py-4 backdrop-blur-md bg-black/30 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <Link href={'/'}>
                  <img src='/ambient-light-logo.svg'></img>
                </Link>
            </div>
        </nav>
    </>
  )
}

export default Navbar