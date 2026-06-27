import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, BACKDROP_CDN_URL } from "../utils/constants";
import { closeMovieDetail, openTrailer } from "../utils/movieDetailSlice";
import MovieList from "./MovieList";

const MovieDetail = () => {
  const dispatch = useDispatch();
  const selectedMovieId = useSelector((store) => store.movieDetail.selectedMovieId);
  const [details,setDetails] = useState(null);
  const [cast,setCast] = useState([]);
  const [similarMovies,setSimilarMovies] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState(null);

  useEffect(() => {
    if (!selectedMovieId) return;

    setDetails(null);
    setCast([]);
    setSimilarMovies([]);
    setError(null);
    setIsLoading(true);

    const fetchMovieDetail = async () => {
      try {
        const [detailsData,creditsData,similarData] = await Promise.all([
          fetch("https://api.themoviedb.org/3/movie/" + selectedMovieId + "?language=en-US", API_OPTIONS),
          fetch("https://api.themoviedb.org/3/movie/" + selectedMovieId + "/credits?language=en-US", API_OPTIONS),
          fetch("https://api.themoviedb.org/3/movie/" + selectedMovieId + "/similar?language=en-US&page=1", API_OPTIONS),
        ]);

        if (!detailsData.ok || !creditsData.ok || !similarData.ok) throw new Error("Movie detail request failed");

        const detailsJson = await detailsData.json();
        const creditsJson = await creditsData.json();
        const similarJson = await similarData.json();

        setDetails(detailsJson);
        setCast((creditsJson.cast || []).slice(0, 5));
        setSimilarMovies((similarJson.results || []).filter((movie) => movie.poster_path));
      } catch (err) {
        setError("Something went wrong while loading this movie.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  },[selectedMovieId]);

  if (!selectedMovieId) return null;

  const releaseYear = details?.release_date ? new Date(details.release_date).getFullYear() : null;
  const runtime = details?.runtime ? details.runtime + " min" : null;
  const rating = details?.vote_average != null ? Number(details.vote_average).toFixed(1) + "/10" : null;
  const genres = details?.genres?.map((genre) => genre.name).filter(Boolean);
  const title = details?.title || details?.original_title;

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-black bg-opacity-85 text-white">
      <div className="min-h-screen px-4 py-10">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-md bg-zinc-950 shadow-2xl">
          <button
            type="button"
            onClick={() => dispatch(closeMovieDetail())}
            aria-label="Close movie detail"
            className="absolute right-4 top-4 z-30 rounded-full bg-black bg-opacity-70 px-3 text-3xl text-white hover:bg-opacity-90"
          >
            ×
          </button>

          {isLoading && (
            <div className="h-[70vh] animate-pulse bg-zinc-900"></div>
          )}

          {!isLoading && error && (
            <div className="p-10 text-lg">{error}</div>
          )}

          {!isLoading && !error && details && (
            <>
              {details.backdrop_path && (
                <div className="relative h-[55vh]">
                  <img
                    src={BACKDROP_CDN_URL + details.backdrop_path}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                </div>
              )}

              <div className="relative -mt-28 px-8 pb-8">
                {title && <h1 className="text-5xl font-bold">{title}</h1>}

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-gray-200">
                  {releaseYear && <span>{releaseYear}</span>}
                  {runtime && <span>{runtime}</span>}
                  {rating && <span>{rating}</span>}
                </div>

                {details.overview && <p className="mt-5 max-w-3xl text-lg text-gray-100">{details.overview}</p>}

                <button
                  type="button"
                  onClick={() => dispatch(openTrailer({ movieId: details.id, title }))}
                  className="mt-6 flex items-center px-8 py-2 bg-white text-black text-xl font-semibold rounded-sm hover:bg-gray-300 transition"
                >
                  <i className="bi bi-play-fill w-6 h-6"></i>
                  Play Trailer
                </button>

                {genres?.length > 0 && (
                  <p className="mt-6 text-gray-300">
                    <span className="text-gray-500">Genres: </span>{genres.join(", ")}
                  </p>
                )}

                {cast.length > 0 && (
                  <p className="mt-3 text-gray-300">
                    <span className="text-gray-500">Cast: </span>{cast.map((person) => person.name).join(", ")}
                  </p>
                )}

                {similarMovies.length > 0 && (
                  <div className="mt-8">
                    <MovieList title="More Like This" movies={similarMovies}/>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
