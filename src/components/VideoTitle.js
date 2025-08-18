import React from 'react'

const VideoTitle = ({title,overview}) => {
  return (
   <div className="absolute inset-0 bg-gradient-to-r from-black">
      <div className="pt-[18%] px-12 ml-5">
        <h1 className="font-bold text-5xl text-white">{title}</h1>
        <p className="w-2/4 text-lg py-6 text-white">{overview}</p>
        <div className="flex gap-3">
          <button className="flex items-center px-8 py-2 bg-white text-black text-xl font-semibold rounded-sm hover:bg-gray-300 transition">
            <i className="bi bi-play-fill w-6 h-6"></i>
            Play
          </button>

          <button className="flex items-center px-4 py-2 bg-gray-600 bg-opacity-50 text-white text-lg font-semibold rounded-sm hover:bg-gray-600 transition">
            <i className="bi bi-info-circle w-6 h-6 mr-2"></i>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoTitle;