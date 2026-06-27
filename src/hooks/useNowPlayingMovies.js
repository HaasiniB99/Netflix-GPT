import { useDispatch, useSelector } from "react-redux";
import { addNowPlayingMovies } from "../utils/moviesSlice";
import { useCallback, useEffect, useState } from "react";
import { API_OPTIONS } from "../utils/constants";

const useNowPlayingMovies = () => {
    const dispatch = useDispatch();
    const nowPlayingMovies = useSelector(store => store.movies.nowPlayingMovies);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(null);

  const getNowPlayingMovies = useCallback(async() => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetch('https://api.themoviedb.org/3/movie/now_playing?page=1', API_OPTIONS);
      if (!data.ok) throw new Error("TMDB request failed");
      const json = await data.json();
     // console.log(json);
      dispatch(addNowPlayingMovies(json.results));
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  },[dispatch]);

  useEffect(() => {
    !nowPlayingMovies && getNowPlayingMovies();
  },[getNowPlayingMovies, nowPlayingMovies]);

  return {isLoading,error};

};

export default useNowPlayingMovies;
