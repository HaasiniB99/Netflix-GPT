import React, { useRef } from 'react'
import MovieCard from './MovieCard'

const MovieList = ({title,movies}) => {
const rowRef = useRef(null);

const handleKeyDown = (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;

  const cards = Array.from(rowRef.current?.querySelectorAll("[tabindex='0']") || []);
  const currentIndex = cards.indexOf(document.activeElement);
  const nextIndex = e.key === "ArrowRight" ? currentIndex + 1 : currentIndex - 1;
  const nextCard = cards[nextIndex];

  if (nextCard) {
    e.preventDefault();
    nextCard.focus();
    nextCard.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }
};

return (
    <div className="px-4 ">
      <h1 className="text-3xl font-medium text-white py-5">{title}</h1>
      <div ref={rowRef} onKeyDown={handleKeyDown} className="flex overflow-x-scroll gap-3">
        {movies && movies.map((movie) => (
          <MovieCard key={movie.id} movieId={movie.id} posterPath={movie.poster_path} title={movie.title || movie.name} />
        ))}
      </div>
    </div>
);
};

export default MovieList;
