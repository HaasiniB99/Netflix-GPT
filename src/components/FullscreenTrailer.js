import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { closeTrailer } from "../utils/movieDetailSlice";

const getTrailer = (videos = []) => {
  const youtubeVideos = videos.filter((video) => video.site === "YouTube" && video.key);
  const trailers = youtubeVideos.filter((video) => video.type === "Trailer");
  const officialTrailer = trailers.find((video) => video.official);
  return officialTrailer || trailers[0] || youtubeVideos[0] || null;
};

const FullscreenTrailer = () => {
  const dispatch = useDispatch();
  const trailerMovie = useSelector((store) => store.movieDetail.trailerMovie);
  const [trailer,setTrailer] = useState(null);
  const [isLoading,setIsLoading] = useState(false);
  const [hasLoaded,setHasLoaded] = useState(false);

  const handleClose = useCallback(() => {
    dispatch(closeTrailer());
  },[dispatch]);

  useEffect(() => {
    if (!trailerMovie?.movieId) return;

    setTrailer(null);
    setHasLoaded(false);
    setIsLoading(true);

    const getMovieVideos = async () => {
      try {
        const data = await fetch("https://api.themoviedb.org/3/movie/" + trailerMovie.movieId + "/videos?language=en-US", API_OPTIONS);
        if (!data.ok) throw new Error("Trailer request failed");
        const json = await data.json();
        setTrailer(getTrailer(json.results || []));
      } catch (err) {
        setTrailer(null);
      } finally {
        setHasLoaded(true);
        setIsLoading(false);
      }
    };

    getMovieVideos();
  },[trailerMovie?.movieId]);

  useEffect(() => {
    if (!trailerMovie) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  },[handleClose, trailerMovie]);

  if (!trailerMovie) return null;

  const youtubeParams = new URLSearchParams({
    autoplay: "1",
    mute: "0",
    controls: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white">
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close trailer"
        className="absolute right-6 top-6 z-[120] text-4xl font-light text-white bg-black bg-opacity-60 px-3 rounded-full hover:bg-opacity-80"
      >
        ×
      </button>

      <div key={trailerMovie.movieId} className="pointer-events-none absolute left-8 top-8 z-[110] rounded-md bg-black bg-opacity-70 px-5 py-3 text-xl font-semibold opacity-0 animate-[fadeTitle_2s_ease-in-out_forwards]">
        Now Playing: {trailerMovie.title}
      </div>

      {isLoading && (
        <div className="flex h-full w-full items-center justify-center text-xl">
          Loading trailer...
        </div>
      )}

      {!isLoading && hasLoaded && !trailer && (
        <div className="flex h-full w-full items-center justify-center text-2xl">
          Trailer unavailable
        </div>
      )}

      {!isLoading && trailer && (
        <iframe
          key={trailer.key}
          className="h-screen w-screen border-0"
          src={"https://www.youtube.com/embed/" + trailer.key + "?" + youtubeParams.toString()}
          title={trailerMovie.title + " trailer"}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default FullscreenTrailer;
