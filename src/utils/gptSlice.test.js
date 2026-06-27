import gptReducer, {
  addGptMovieResult,
  addTitleSearchResults,
  clearTitleSearchView,
  startTitleSearch,
} from "./gptSlice";

const initialState = {
  showGptSearch: false,
  showTitleSearch: false,
  titleSearchQuery: "",
  titleSearchResults: [],
  titleSearchLoading: false,
  titleSearchError: null,
  hasTitleSearched: false,
  gptMovies: null,
  movieNames: null,
  movieResults: null,
};

describe("gptSlice", () => {
  test("returns the correct initial state", () => {
    expect(gptReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test("addGptMovieResult stores GPT movie names and TMDB results", () => {
    const movieNames = ["Inception", "Interstellar"];
    const movieResults = [
      [{ id: 1, title: "Inception" }],
      [{ id: 2, title: "Interstellar" }],
    ];

    const state = gptReducer(initialState, addGptMovieResult({ movieNames, movieResults }));

    expect(state.gptMovies).toEqual({ movieNames, movieResults });
    expect(state.movieNames).toEqual(movieNames);
    expect(state.movieResults).toEqual(movieResults);
  });

  test("clearTitleSearchView resets title search state without changing GPT results", () => {
    const searchedState = gptReducer(initialState, startTitleSearch("avatar"));
    const resultsState = gptReducer(searchedState, addTitleSearchResults([{ id: 1, title: "Avatar" }]));

    const state = gptReducer(resultsState, clearTitleSearchView());

    expect(state).toEqual(initialState);
  });
});
