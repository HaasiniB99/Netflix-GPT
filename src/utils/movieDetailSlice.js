import { createSlice } from "@reduxjs/toolkit";

const movieDetailSlice = createSlice({
    name:"movieDetail",
    initialState:{
        selectedMovieId : null,
        trailerMovie : null,
    },
    reducers:{
        openMovieDetail : (state,action) => {
            state.selectedMovieId = action.payload;
        },
        closeMovieDetail : (state) => {
            state.selectedMovieId = null;
        },
        openTrailer : (state,action) => {
            state.trailerMovie = action.payload;
        },
        closeTrailer : (state) => {
            state.trailerMovie = null;
        },
    },
});

export const { openMovieDetail,closeMovieDetail,openTrailer,closeTrailer } = movieDetailSlice.actions;
export default movieDetailSlice.reducer;
