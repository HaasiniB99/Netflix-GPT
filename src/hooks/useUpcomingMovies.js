import { useDispatch, useSelector } from "react-redux"
import { API_OPTIONS } from "../utils/constants";
import { addUpcomingMovies } from "../utils/moviesSlice";
import { useCallback, useEffect, useState } from "react";

const useUpcomingMovies = () => {
    const dispatch = useDispatch();
    const upcomingMovies = useSelector(store => store.movies.upcomingMovies);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(null);
    const getUpcomingMovies = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', API_OPTIONS)
            if (!data.ok) throw new Error("TMDB request failed");
            const json = await data.json();
            dispatch(addUpcomingMovies(json.results));
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    },[dispatch]);
    useEffect(() => {
        !upcomingMovies && getUpcomingMovies();
    },[getUpcomingMovies, upcomingMovies]);

    return {isLoading,error};

};
export default useUpcomingMovies;
