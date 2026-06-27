import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import VideoTitle from "./VideoTitle";
import { BACKDROP_CDN_URL } from "../utils/constants";
import { openTrailer } from "../utils/movieDetailSlice";

const MainContainer = () => {

    const dispatch = useDispatch();
    const movies = useSelector((store) => store.movies?.nowPlayingMovies);
    const trailerMovie = useSelector((store) => store.movieDetail.trailerMovie);
    const heroMovies = useMemo(
      () => (movies || []).filter((movie) => movie.backdrop_path).slice(0, 6),
      [movies]
    );
    const [activeIndex,setActiveIndex] = useState(0);
    const [isPaused,setIsPaused] = useState(false);
    const mainMovie = heroMovies[activeIndex] || movies?.[0];
    const { original_title,title,overview }  = mainMovie || {};

    useEffect(() => {
      if (isPaused || trailerMovie || heroMovies.length <= 1) return;

      const intervalId = setInterval(() => {
        setActiveIndex((currentIndex) => (currentIndex + 1) % heroMovies.length);
      }, 3000);

      return () => clearInterval(intervalId);
    },[heroMovies.length, isPaused, trailerMovie]);

    useEffect(() => {
      if (activeIndex >= heroMovies.length) setActiveIndex(0);
    },[activeIndex, heroMovies.length]);

    if(!movies) return;

    //console.log("video title");

  return (
    <div
      className="relative h-screen overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
        <div className="absolute inset-0">
          {heroMovies.map((movie,index) => (
            <img
              key={movie.id}
              src={BACKDROP_CDN_URL + movie.backdrop_path}
              alt={movie.title || movie.original_title}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <VideoTitle
          title={original_title || title}
          overview={overview}
          onPlayTrailer={() => dispatch(openTrailer({ movieId: mainMovie?.id, title: original_title || title }))}
        />
    </div>
  );
};

export default MainContainer;
