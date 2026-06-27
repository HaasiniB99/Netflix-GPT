import React, { useRef, useState } from 'react'
import { API_OPTIONS, BgLOGO, LANG_TO_INDUSTRY, LANG_TO_TMDB_CODE } from "../utils/constants";
import { useDispatch } from 'react-redux';
import openAI from '../utils/openai';
import { addGptMovieResult } from '../utils/gptSlice';
import GptMovieSuggestions from './GptMovieSuggestions';

const GptSearch = () => {

  const defaultLangKey = "en";
  const searchText = useRef(null);
  const refineText = useRef(null);
  const dispatch = useDispatch();
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState(null);
  const [lastAction,setLastAction] = useState(null);
  const [originalQuery,setOriginalQuery] = useState("");
  const [lastGptMovies,setLastGptMovies] = useState(null);
  const [hasResults,setHasResults] = useState(false);

  const languageNames = {
    en: "English",
    telugu: "Telugu",
    tamil: "Tamil",
    kannada: "Kannada",
    hindi: "Hindi",
  };

  const languagePatterns = {
    en: /\b(english|hollywood)\b/i,
    telugu: /\b(telugu|tollywood)\b/i,
    tamil: /\b(tamil|kollywood)\b/i,
    kannada: /\b(kannada|sandalwood)\b/i,
    hindi: /\b(hindi|bollywood)\b/i,
  };

  const languageCountryCodes = {
    en: ["US", "GB", "AU", "CA"],
    telugu: ["IN"],
    tamil: ["IN"],
    kannada: ["IN"],
    hindi: ["IN"],
  };

  const getEffectiveLangKey = (query = "") => {
    const explicitLanguage = Object.entries(languagePatterns).find(([, pattern]) => pattern.test(query));
    return explicitLanguage?.[0] || defaultLangKey;
  };

  const getLanguageConfig = (query = "") => {
    const effectiveLangKey = getEffectiveLangKey(query);
    const tmdbCode = LANG_TO_TMDB_CODE[effectiveLangKey] || LANG_TO_TMDB_CODE.en;
    const industry = LANG_TO_INDUSTRY[effectiveLangKey] || LANG_TO_INDUSTRY.en;
    const languageName = languageNames[effectiveLangKey] || languageNames.en;
    return { effectiveLangKey, tmdbCode, industry, languageName };
  };

  const getSystemMessage = (query = "") => {
    const { industry, tmdbCode } = getLanguageConfig(query);
    return "You are a strict movie recommendation engine for the " + industry + " film industry. Only suggest real movies whose TMDB original_language is \"" + tmdbCode + "\" and that genuinely match the user's genre/mood request. Do not suggest Hollywood/English movies unless the selected industry is Hollywood/English. Respond with ONLY 5 movie names, comma-separated, no numbering, no extra text, no explanation - exactly the format: MovieA, MovieB, MovieC, MovieD, MovieE";
  };

  const getCleanQuery = (query = "") => (
    query
      .replace(/\b(in|only|from)\s+(english|hollywood|telugu|tollywood|tamil|kollywood|kannada|sandalwood|hindi|bollywood)\b/gi, " ")
      .replace(/\b(english|hollywood|telugu|tollywood|tamil|kollywood|kannada|sandalwood|hindi|bollywood)\s+(only|movies|films|cinema)\b/gi, " ")
      .replace(/\b(english|hollywood|telugu|tollywood|tamil|kollywood|kannada|sandalwood|hindi|bollywood)\b/gi, " ")
      .replace(/\b(only|movies|films|cinema)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
  );

  const toTitleCase = (value) => (
    value
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );

  const getGenreIdsFromQuery = (query) => {
    const normalizedQuery = getCleanQuery(query).toLowerCase();
    const genreMap = [
      { id: 28, terms: ["action", "fight", "martial"] },
      { id: 12, terms: ["adventure"] },
      { id: 16, terms: ["animation", "animated"] },
      { id: 35, terms: ["comedy", "comedies", "funny", "humor", "humour"] },
      { id: 80, terms: ["crime", "gangster", "mafia"] },
      { id: 18, terms: ["drama", "emotional"] },
      { id: 27, terms: ["horror", "scary", "ghost"] },
      { id: 9648, terms: ["mystery", "suspense"] },
      { id: 10749, terms: ["romance", "romantic", "love"] },
      { id: 878, terms: ["sci-fi", "science fiction", "science-fiction"] },
      { id: 53, terms: ["thriller", "thrillers", "tense"] },
    ];

    return genreMap
      .filter((genre) => genre.terms.some((term) => normalizedQuery.includes(term)))
      .map((genre) => ({ id: genre.id, label: genre.terms[0] }));
  };

  const fetchTmdbMovies = async (endpoint, params) => {
    const queryParams = new URLSearchParams(params);
    const data = await fetch("https://api.themoviedb.org/3/" + endpoint + "?" + queryParams.toString(), API_OPTIONS);
    if (!data.ok) throw new Error("TMDB request failed");
    const json = await data.json();
    return json.results || [];
  };

  const matchesSelectedLanguage = (movie, tmdbCode, effectiveLangKey) => {
    const countryCodes = languageCountryCodes[effectiveLangKey] || [];
    return (
      movie?.original_language === tmdbCode &&
      (!Array.isArray(movie?.origin_country) ||
        movie.origin_country.length === 0 ||
        movie.origin_country.some((country) => countryCodes.includes(country)))
    );
  };

  const filterByOriginalLanguage = (movies, tmdbCode, effectiveLangKey) => (
    (movies || []).filter((movie) => matchesSelectedLanguage(movie, tmdbCode, effectiveLangKey))
  );

  const getSuccessfulRows = async (rowPromises) => {
    const settledRows = await Promise.allSettled(rowPromises);
    return settledRows
      .filter((result) => result.status === "fulfilled" && result.value?.movies?.length > 0)
      .map((result) => result.value);
  };

  const getRowTitle = (query, page) => {
    const { languageName } = getLanguageConfig(query);
    const genreLabels = getGenreIdsFromQuery(query).map((genre) => genre.label);
    const cleanQuery = getCleanQuery(query);
    const label = genreLabels.length > 0 ? genreLabels.join(" ") : cleanQuery;
    const baseTitle = toTitleCase([languageName, label || "Movies"].join(" "));
    return page === 1 ? baseTitle : "More " + baseTitle;
  };

  const discoverMoviesByLanguage = async (query, page = 1, matchAllGenres = true) => {
    const { tmdbCode, effectiveLangKey } = getLanguageConfig(query);
    const genreIds = getGenreIdsFromQuery(query);
    const discoverParams = {
      include_adult: "false",
      include_video: "false",
      language: "en-US",
      page: String(page),
      sort_by: "popularity.desc",
      with_original_language: tmdbCode,
      "vote_count.gte": "10",
    };

    if (genreIds.length > 0) {
      discoverParams.with_genres = genreIds.map((genre) => genre.id).join(matchAllGenres ? "," : "|");
    }

    const results = await fetchTmdbMovies("discover/movie", discoverParams);
    return {
      rowTitle: getRowTitle(query, page),
      movies: filterByOriginalLanguage(results, tmdbCode, effectiveLangKey),
    };
  };

  const discoverGenreRows = async (query) => {
    const genreIds = getGenreIdsFromQuery(query);
    if (genreIds.length === 0) return null;

    const rowsWithMovies = await getSuccessfulRows(
      [1, 2, 3, 4, 5].map((page) => discoverMoviesByLanguage(query, page, true))
    );
    if (rowsWithMovies.length > 0) return rowsWithMovies;

    return getSuccessfulRows(
      [1, 2, 3, 4, 5].map((page) => discoverMoviesByLanguage(query, page, false))
    );
  };

  const getGptMovies = async (messages) => {
    const makeRequest = async () => {
      const gptResults = await openAI.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        messages,
        temperature: 0.4,
      });

      return gptResults?.choices?.[0]?.message?.content?.split(",").map((movie) => movie.trim()).filter(Boolean);
    };

    let gptMovies = await makeRequest();
    if (!gptMovies || gptMovies.length === 0) gptMovies = await makeRequest();
    return gptMovies?.slice(0, 5) || [];
  };

  //search movie in TMDB
  const searchMovieTMDB = async (movie, query, fallbackPage) => {
    if (!movie || typeof movie !== "string") return null; // safeguard

    const { tmdbCode, effectiveLangKey } = getLanguageConfig(query);
    const results = await fetchTmdbMovies("search/movie", {
      query: movie,
      include_adult: "false",
      language: "en-US",
      page: "1",
    });
    const languageMatches = filterByOriginalLanguage(results, tmdbCode, effectiveLangKey);
    // const exactMatch = json.results.filter(
    //   (m) => m.title.toLowerCase() === movie.toLowerCase()
    // );
    // return exactMatch.length > 0 ? exactMatch[0] : []; // return first exact match
    if (languageMatches.length > 0) {
      return {
        rowTitle: movie,
        movies: languageMatches,
      };
    }

    return discoverMoviesByLanguage(query, fallbackPage);
  };

  const runSearch = async (messages, action, nextOriginalQuery) => {
    setIsLoading(true);
    setError(null);
    setLastAction(() => action);

    try {
      const genreRows = await discoverGenreRows(nextOriginalQuery);
      let tmdbRows = genreRows;

      if (!tmdbRows || tmdbRows.length === 0) {
        const gptMovies = await getGptMovies(messages);
        const promiseArray = gptMovies.map((movie,index) => searchMovieTMDB(movie, nextOriginalQuery, index + 1));
        tmdbRows = await getSuccessfulRows(promiseArray);
      }

      if (!tmdbRows || tmdbRows.length === 0) {
        tmdbRows = await getSuccessfulRows(
          [1, 2, 3, 4, 5].map((page) => discoverMoviesByLanguage(nextOriginalQuery, page, false))
        );
      }

      if (!tmdbRows || tmdbRows.length === 0) throw new Error("No movies found");

      const movieNames = tmdbRows.map((row) => row.rowTitle);
      const tmdbResults = tmdbRows.map((row) => row.movies);

      dispatch(addGptMovieResult({movieNames,movieResults : tmdbResults}));
      setOriginalQuery(nextOriginalQuery);
      setLastGptMovies(movieNames);
      setHasResults(true);
      if (refineText.current) refineText.current.value = "";
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGptSearchClick = (e) => {
    e.preventDefault();
    const query = searchText.current.value.trim();
    if (!query) return;
    const messages = [
      { role: "system", content: getSystemMessage(query) },
      { role: "user", content: query },
    ];
    const retry = () => runSearch(messages, retry, query);
    runSearch(messages, retry, query);
  };

  const handleRefineSearch = (e) => {
    e.preventDefault();
    const refinement = refineText.current.value.trim();
    if (!refinement) return;
    const refinedQuery = originalQuery + " " + refinement;
    const previousMovies = lastGptMovies || [];
    const messages = [
      { role: "system", content: getSystemMessage(refinedQuery) },
      { role: "user", content: originalQuery },
      { role: "user", content: "Previous suggestions were: " + previousMovies.join(", ") + ". Now refine based on: " + refinement },
    ];
    const retry = () => runSearch(messages, retry, refinedQuery);
    runSearch(messages, retry, refinedQuery);
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black">

    {/* Top Half */}
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden">
        <div className="flex animate-scroll-left">
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
        </div>
      </div>

      {/* Bottom Half */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden">
        <div className="flex animate-scroll-right">
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
            <img src={BgLOGO} alt='bg-logo' className="w-full object-cover"></img>
        </div>
      </div>
    </div>

    {/* Search Bar in Center */}
    <div className="relative z-10 min-h-screen pt-36 pb-16">
        <div className="flex justify-center w-full cursor-default">
  {/* Siri Border Wrapper */}
  <div className="relative p-[3px] rounded-xl overflow-hidden w-3/4 max-w-3xl">
    {/* Gradient Border Effect */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 via-blue-400 via-green-400 via-yellow-400 to-purple-500 
                    bg-[length:400%_400%] animate-rotateGradient "></div>

        {/* Inner Search Bar */}
        <div className="relative flex z-10">

        {/* search bar */}
     <form className="flex w-full" onSubmit={handleGptSearchClick} >
  {/* Input with icon */}
  <div className="relative flex-grow ">
    <span className="absolute left-3 top-1/2 -translate-y-1/2">
      <i className="bi bi-eyeglasses text-3xl text-gray-600"></i>
    </span>
    <input
      ref={searchText}
      type="text"
      placeholder="Let's choose together, what are we watching?"
      className="w-full pl-12 pr-4 py-3 rounded-l-xl bg-gray-200 text-black placeholder-gray-600 outline-none focus:ring-2 focus:ring-red-500"
    />
  </div>

  {/* Submit button */}
  <button
    type="submit"
    tabIndex={0}
    className="z-10 px-6 py-3 rounded-r-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 outline-none"
  >
    Search
  </button>
</form>
        </div>
        
    </div>
        </div>
        <div className="w-full mt-10 pb-16">
          <GptMovieSuggestions isLoading={isLoading} error={error} onRetry={lastAction} />
          {hasResults && !isLoading && !error && (
            <form onSubmit={handleRefineSearch} className="flex w-3/4 max-w-3xl mx-auto mt-4">
              <input
                ref={refineText}
                type="text"
                placeholder="Refine your results..."
                className="w-full px-4 py-3 rounded-l-xl bg-gray-200 text-black placeholder-gray-600 outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                tabIndex={0}
                className="z-10 px-6 py-3 rounded-r-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 outline-none"
              >
                Refine
              </button>
            </form>
          )}
        </div>
    </div>
    </div>
  );
};

export default GptSearch;
