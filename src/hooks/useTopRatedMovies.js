import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { addTopRatedMovies } from "../utils/moviesSlice";
import { useCallback, useEffect, useState } from "react";

const useTopRatedMovies = () => {

    const dispatch = useDispatch();
    const topRatedMovies = useSelector(store => store.movies.topRatedMovies);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(null);

    const getTopRatedMovies = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetch('https://api.themoviedb.org/3/movie/top_rated?page=1', API_OPTIONS)
            if (!data.ok) throw new Error("TMDB request failed");
            const json = await data.json();
            //console.log(json);
            dispatch(addTopRatedMovies(json.results));
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    },[dispatch]);
    useEffect(() => {
        !topRatedMovies && getTopRatedMovies();
    },[getTopRatedMovies, topRatedMovies]);

    return {isLoading,error};

};

export default useTopRatedMovies;
