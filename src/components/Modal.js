import React from 'react';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-gray-900 shadow-xl transition-all border border-gray-700">
          {/* Content */}
          <div className="py-6 px-4 md:p-6 text-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
