import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
    name : "gpt",
    initialState : {
        showGptSearch : false,
        showTitleSearch : false,
        titleSearchQuery : "",
        titleSearchResults : [],
        titleSearchLoading : false,
        titleSearchError : null,
        hasTitleSearched : false,
        gptMovies : null,
        movieNames : null,
        movieResults : null,
    },
    reducers : {
        toggleGptSearchView : (state) => {
            state.showGptSearch = !state.showGptSearch;
            state.showTitleSearch = false;
        },
        closeGptSearchView : (state) => {
            state.showGptSearch = false;
        },
        clearTitleSearchView : (state) => {
            state.showTitleSearch = false;
            state.titleSearchQuery = "";
            state.titleSearchResults = [];
            state.titleSearchLoading = false;
            state.titleSearchError = null;
            state.hasTitleSearched = false;
        },
        startTitleSearch : (state,action) => {
            state.showGptSearch = false;
            state.showTitleSearch = true;
            state.titleSearchQuery = action.payload;
            state.titleSearchResults = [];
            state.titleSearchLoading = true;
            state.titleSearchError = null;
            state.hasTitleSearched = true;
        },
        addTitleSearchResults : (state,action) => {
            state.titleSearchResults = action.payload;
            state.titleSearchLoading = false;
            state.titleSearchError = null;
        },
        addTitleSearchError : (state,action) => {
            state.titleSearchResults = [];
            state.titleSearchLoading = false;
            state.titleSearchError = action.payload;
        },
        addGptMovieResult : (state,action) => {
            const {movieNames,movieResults} = action.payload;
            state.gptMovies = action.payload;
            state.movieNames = movieNames;
            state.movieResults = movieResults;
        }
    },
});

export const{
    toggleGptSearchView,
    closeGptSearchView,
    clearTitleSearchView,
    startTitleSearch,
    addTitleSearchResults,
    addTitleSearchError,
    addGptMovieResult,
} = gptSlice.actions;
export default gptSlice.reducer;
