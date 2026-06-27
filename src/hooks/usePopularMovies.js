import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { addPopularMovies } from "../utils/moviesSlice";
import { useCallback, useEffect, useState } from "react";

const usePopularMovies = () => {

    const dispatch = useDispatch();
    const popularMovies = useSelector(store => store.movies.popularMovies);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(null);

    const getPopularMovies = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetch('https://api.themoviedb.org/3/movie/popular?page=1', API_OPTIONS)
            if (!data.ok) throw new Error("TMDB request failed");
            const json = await data.json();
            //console.log(json);
            dispatch(addPopularMovies(json.results));
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    },[dispatch]);
    useEffect(() => {
        !popularMovies && getPopularMovies();
    },[getPopularMovies, popularMovies]);

    return {isLoading,error};

};

export default usePopularMovies;
