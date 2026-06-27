import React from 'react'
import MovieList from './MovieList';
import { useSelector } from 'react-redux';

const SecondaryContainer = ({error}) => {
    const movies = useSelector((store) => store.movies);
  return (
    movies.nowPlayingMovies && ( 
        <div className="bg-black">
            <div className='relative -mt-52 z-20 px-12'>
                {error && <div className="text-white bg-red-600 px-4 py-3 rounded-md mb-4">{error}</div>}
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
