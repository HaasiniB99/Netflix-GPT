import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { useCallback, useEffect } from "react";
import { addTrailerVideo } from "../utils/moviesSlice";

const useMovieTrailer = (movieId) => {
    //Fetch trailer video & update store with trailer video data
    const dispatch = useDispatch();
    const trailerVideo = useSelector(store => store.movies.trailerVideo);

    const getMovieVideos = useCallback(async() => {
        const data = await fetch("https://api.themoviedb.org/3/movie/" + movieId + "/videos?language=en-US", API_OPTIONS);
        if (!data.ok) return;
        const json = await data.json();
       // console.log(json);

        const youtubeVideos = (json.results || []).filter((video) => video.site === "YouTube" && video.key);
        const filterData = youtubeVideos.filter((video) => video.type === "Trailer");
        const officialTrailer = filterData.find((video) => video.official);
        const trailer = officialTrailer || filterData[0] || youtubeVideos[0] || null;
        dispatch(addTrailerVideo(trailer));
    },[dispatch, movieId]);

    useEffect(() => {
        !trailerVideo && getMovieVideos();
    },[getMovieVideos, trailerVideo]);
};

export default useMovieTrailer;
