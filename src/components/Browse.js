import React from 'react'
import Header from './Header'
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import MainContainer from './MainContainer';
import SecondaryContainer from './SecondaryContainer';
import usePopularMovies from '../hooks/usePopularMovies';
import useTopRatedMovies from '../hooks/useTopRatedMovies';
import useUpcomingMovies from '../hooks/useUpcomingMovies';
import GptSearch from './GptSearch';
import { useSelector } from 'react-redux';
import GptMovieSuggestions from './GptMovieSuggestions';

const Browse = () => {
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

  useNowPlayingMovies();
  usePopularMovies();
  useTopRatedMovies();
  useUpcomingMovies();

  return (
    <div>

      <Header/>
      { showGptSearch ? 
        <>
        <div className="relative">
      {/* Background + search bar */}
      <GptSearch />

      {/* Movie list, starts below search bar */}
        <div className="absolute left-0 w-full z-10 -mt-96">
          <GptMovieSuggestions />
        </div>
      </div>

        </>
         : 
        <>
          <MainContainer/>
          <SecondaryContainer/>
        </>
      }

    </div>
  );
};

export default Browse;