import React from 'react'
import { BgLOGO } from "../utils/constants";
import lang from '../utils/languageConstants';
import { useSelector } from 'react-redux';


const GptSearch = () => {

  const langKey = useSelector((store) => store.config.lang);

  return (
    <div className="relative w-full h-screen overflow-hidden">

    {/* Top Half */}
      <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden">
        <div className="flex animate-scroll-left">
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
        </div>
      </div>

      {/* Bottom Half */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden">
        <div className="flex animate-scroll-right">
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
        </div>
      </div>

    {/* Search Bar in Center */}
        <div className="flex justify-center items-center h-screen w-full cursor-default">
  {/* Siri Border Wrapper */}
  <div className="relative p-[3px] rounded-xl overflow-hidden w-3/4 max-w-3xl -mt-64">
    {/* Gradient Border Effect */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 via-blue-400 via-green-400 via-yellow-400 to-purple-500 
                    bg-[length:400%_400%] animate-rotateGradient "></div>

        {/* Inner Search Bar */}
        <div className="relative flex z-10">

        {/* search bar */}
      <div className="relative flex-grow ">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <i className="bi bi-eyeglasses text-3xl text-gray-600"></i>
        </span>
        <input
          type="text"
          placeholder={lang[langKey].gptSearchPlaceholder}
          className="w-full pl-12 pr-4 py-3 rounded-l-xl bg-gray-200 text-black placeholder-gray-600 outline-none"
        />
      </div>
      {/* search button */}
      <button className="z-10 px-6 py-3 rounded-r-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">
        {lang[langKey].search}
      </button>

        </div>
        
    </div>
        </div>
        
    </div>
  );
};

export default GptSearch;