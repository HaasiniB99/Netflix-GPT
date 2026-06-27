import React from "react";
import { useSelector } from "react-redux";
import MovieCard from "./MovieCard";

const TitleSearchResults = () => {
  const {
    titleSearchQuery,
    titleSearchResults,
    titleSearchLoading,
    titleSearchError,
    hasTitleSearched,
  } = useSelector((store) => store.gpt);

  const moviesWithPosters = (titleSearchResults || []).filter((movie) => movie.poster_path);

  return (
    <div className="min-h-screen bg-black pt-28 px-8 md:px-12 text-white">
      <h1 className="text-3xl font-medium py-5">
        {titleSearchQuery ? `Search results for "${titleSearchQuery}"` : "Search results"}
      </h1>

      {titleSearchLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="w-40 md:w-48 lg:w-52 h-60 md:h-72 lg:h-80 bg-gray-800 rounded-md animate-pulse" />
          ))}
        </div>
      )}

      {!titleSearchLoading && titleSearchError && (
        <div className="bg-red-700 bg-opacity-80 px-4 py-3 rounded-md max-w-xl">
          {titleSearchError}
        </div>
      )}

      {!titleSearchLoading && !titleSearchError && hasTitleSearched && moviesWithPosters.length === 0 && (
        <p className="text-lg text-gray-300">No results found.</p>
      )}

      {!titleSearchLoading && !titleSearchError && moviesWithPosters.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 pb-12">
          {moviesWithPosters.map((movie) => (
            <MovieCard key={movie.id} movieId={movie.id} posterPath={movie.poster_path} title={movie.title || movie.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TitleSearchResults;
