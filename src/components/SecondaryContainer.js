import React from 'react'
import MovieList from './MovieList';
import { useSelector } from 'react-redux';

const SecondaryContainer = () => {
    const movies = useSelector((store) => store.movies);
  return (
    movies.nowPlayingMovies && ( 
        <div className="bg-black">
            <div className='relative -mt-52 z-20 px-12'>
                <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies}/>
                <MovieList title={"Upcoming Movies"} movies={movies.upcomingMovies}/>
                <MovieList title={"Top Rated"} movies={movies.topRatedMovies}/>
                <MovieList title={"Popular"} movies={movies.popularMovies}/>
                <MovieList title={"Comedy"} movies={movies.nowPlayingMovies}/>
            </div>
        </div>
    )
  );
};

export default SecondaryContainer;