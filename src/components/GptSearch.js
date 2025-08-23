import React, { useRef } from 'react'
import { API_OPTIONS, BgLOGO } from "../utils/constants";
import lang from '../utils/languageConstants';
import { useDispatch, useSelector } from 'react-redux';
import openAI from '../utils/openai';
import { addGptMovieResult } from '../utils/gptSlice';

const GptSearch = () => {

  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);
  const dispatch = useDispatch();

  //search movie in TMDB
  const searchMovieTMDB = async (movie) => {
    if (!movie || typeof movie !== "string") return null; // safeguard

    const data = await fetch('https://api.themoviedb.org/3/search/movie?query=' + movie + '&include_adult=false&language=en-US&page=1', API_OPTIONS) ;
    const json =await data.json();
    // const exactMatch = json.results.filter(
    //   (m) => m.title.toLowerCase() === movie.toLowerCase()
    // );
    // return exactMatch.length > 0 ? exactMatch[0] : []; // return first exact match
    return json.results;
  };

  const handleGptSearchClick = async() => {
    console.log(searchText.current.value);
    //Make API call to GPT to get movie results

    const gptQuery = "Act as a Movie Recommendation system and suggest some movies for the query : " + searchText.current.value + "only give me names of 5 movies with comma separated as shown in the example ahead.Example Result : Avatar , Terminator , Jurassic world , KGF , Bahubali ";

    const gptResults = await openAI.chat.completions.create({
      model: "openai/gpt-oss-20b:free", 
      messages: [{ role: "user", content: gptQuery}],
    });

    console.log(gptResults.choices?.[0]?.message?.content);
    const gptMovies = gptResults?.choices?.[0]?.message?.content?.split(",").map((movie) => movie.trim());//to make the movies like an array
    //for each movie,search in tmdb api
    if (gptMovies) {
    const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
    const tmdbResults = await Promise.all(promiseArray)
    console.log("TMDB Results: ", tmdbResults);

    dispatch(addGptMovieResult({movieNames :gptMovies,movieResults : tmdbResults}));

    console.log("🎬 Exact Matches from TMDB:", tmdbResults.filter(Boolean));
  }};

  return (
    <div className="relative w-full h-screen overflow-hidden">

    {/* Top Half */}
    <div>
      <div className="fixed top-0 left-0 w-full h-1/2 overflow-hidden">
        <div className="flex animate-scroll-left">
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
        </div>
      </div>

      {/* Bottom Half */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 overflow-hidden">
        <div className="flex animate-scroll-right">
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
        </div>
      </div>
    </div>

    {/* Search Bar in Center */}
        <div className="flex justify-center items-center h-screen w-full cursor-default -mt-12">
  {/* Siri Border Wrapper */}
  <div className="relative p-[3px] rounded-xl overflow-hidden w-3/4 max-w-3xl -mt-64">
    {/* Gradient Border Effect */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 via-blue-400 via-green-400 via-yellow-400 to-purple-500 
                    bg-[length:400%_400%] animate-rotateGradient "></div>

        {/* Inner Search Bar */}
        <div className="relative flex z-10">

        {/* search bar */}
     <form className="flex w-full" onClick={(e) => e.preventDefault()} >
  {/* Input with icon */}
  <div className="relative flex-grow ">
    <span className="absolute left-3 top-1/2 -translate-y-1/2">
      <i className="bi bi-eyeglasses text-3xl text-gray-600"></i>
    </span>
    <input
      ref={searchText}
      type="text"
      placeholder={lang[langKey].gptSearchPlaceholder}
      className="w-full pl-12 pr-4 py-3 rounded-l-xl bg-gray-200 text-black placeholder-gray-600 outline-none"
    />
  </div>

  {/* Submit button */}
  <button
    onClick={handleGptSearchClick}
    type="submit"
    className="z-10 px-6 py-3 rounded-r-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
  >
    {lang[langKey].search}
  </button>
</form>
        </div>
        
    </div>
        </div>
        
    </div>
  );
};

export default GptSearch;