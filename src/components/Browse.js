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
import TitleSearchResults from './TitleSearchResults';
import MovieDetail from './MovieDetail';
import FullscreenTrailer from './FullscreenTrailer';

const Browse = () => {
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const showTitleSearch = useSelector((store) => store.gpt.showTitleSearch);

  const nowPlayingState = useNowPlayingMovies();
  const popularState = usePopularMovies();
  const topRatedState = useTopRatedMovies();
  const upcomingState = useUpcomingMovies();
  const categoryError = nowPlayingState.error || popularState.error || topRatedState.error || upcomingState.error;

  return (
    <div className="min-h-screen bg-black">

      <Header/>
      { showGptSearch ? 
        <>
        <div className="relative">
      {/* Background + search bar */}
      <GptSearch />
      </div>

        </>
         : showTitleSearch ?
        <TitleSearchResults/>
         : 
        <>
          <MainContainer/>
          <SecondaryContainer error={categoryError}/>
        </>
      }
      <MovieDetail/>
      <FullscreenTrailer/>

    </div>
  );
};

export default Browse;
