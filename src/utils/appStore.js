import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import gptReducer from "./gptSlice";
import movieDetailReducer from "./movieDetailSlice";

const appStore = configureStore({
    reducer:{
        user : userReducer,
        movies : moviesReducer,
        gpt : gptReducer,
        movieDetail : movieDetailReducer,
    },
});

export default appStore;
