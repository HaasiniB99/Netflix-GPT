import React from 'react'
import MovieCard from './MovieCard'

const MovieList = ({title,movies}) => {
return (
    <div className="px-4">
      <h1 className="text-3xl font-medium text-white py-5">{title}</h1>
      <div className="flex overflow-x-scroll gap-3">
        {movies && movies.map((movie) => (
          <MovieCard key={movie.id} posterPath={movie.poster_path} />
        ))}
      </div>
    </div>
);
};

export default MovieList;