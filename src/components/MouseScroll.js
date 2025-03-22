'use client';

const MouseScroll = () => {
  const handleClick = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div 
      className="flex justify-center fixed bottom-8 left-1/2 -translate-x-1/2 z-50 cursor-pointer" 
      onClick={handleClick}
    >
      <div className="w-[25px] h-[40px] border-2 border-white rounded-full relative flex justify-center">
        <div className="scroll-indicator"></div>
      </div>
      
      <style jsx>{`
        .scroll-indicator {
          width: 3px;
          height: 8px;
          background-color: white;
          border-radius: 2px;
          position: absolute;
          animation: scrollAnimation 2s ease-in-out infinite;
        }

        @keyframes scrollAnimation {
          0% { 
            top: 10px;
          }
          50% { 
            top: 20px;
          }
          100% { 
            top: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default MouseScroll;