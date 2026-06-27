import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Header from "./Header";
import gptReducer from "../utils/gptSlice";
import userReducer from "../utils/userSlice";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

jest.mock("../utils/firebase", () => ({
  auth: {},
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth, callback) => {
    callback({
      uid: "user-1",
      email: "user@example.com",
      displayName: "Test User",
      photoURL: "avatar.png",
    });
    return jest.fn();
  },
  signOut: jest.fn(() => Promise.resolve()),
}));

const setupHeader = (showGptSearch) => {
  const appStore = configureStore({
    reducer: {
      user: userReducer,
      gpt: gptReducer,
    },
    preloadedState: {
      gpt: {
        showGptSearch,
        showTitleSearch: false,
        titleSearchQuery: "",
        titleSearchResults: [],
        titleSearchLoading: false,
        titleSearchError: null,
        hasTitleSearched: false,
        gptMovies: null,
        movieNames: null,
        movieResults: null,
      },
    },
  });

  render(
    <Provider store={appStore}>
      <Header />
    </Provider>
  );

  return appStore;
};

test("Home closes GPT mode and stays on browse", async () => {
  const appStore = setupHeader(true);
  mockNavigate.mockClear();

  await userEvent.click(screen.getByRole("button", { name: "Home" }));

  expect(appStore.getState().gpt.showGptSearch).toBe(false);
  expect(mockNavigate).toHaveBeenCalledWith("/browse");
});

test("Home is safe when already on the normal browse view", async () => {
  const appStore = setupHeader(false);
  mockNavigate.mockClear();

  await userEvent.click(screen.getByRole("button", { name: "Home" }));

  expect(appStore.getState().gpt.showGptSearch).toBe(false);
  expect(mockNavigate).toHaveBeenCalledWith("/browse");
});

test("Search icon submits a direct TMDB title search", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ results: [{ id: 1, title: "Inception", poster_path: "/poster.jpg" }] }),
    })
  );
  const appStore = setupHeader(true);
  mockNavigate.mockClear();

  await userEvent.click(screen.getByRole("button", { name: "Search" }));
  await userEvent.type(screen.getByPlaceholderText("Search movies"), "Inception");
  await userEvent.click(screen.getByRole("button", { name: "Submit movie search" }));

  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining("https://api.themoviedb.org/3/search/movie?"),
    expect.any(Object)
  );
  expect(global.fetch.mock.calls[0][0]).toContain("query=Inception");
  expect(appStore.getState().gpt.showGptSearch).toBe(false);
  expect(appStore.getState().gpt.showTitleSearch).toBe(true);
  await waitFor(() => expect(appStore.getState().gpt.titleSearchResults).toHaveLength(1));
  expect(mockNavigate).toHaveBeenCalledWith("/browse");
});

test("Search stores an empty result set when TMDB has no matches", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    })
  );
  const appStore = setupHeader(false);
  mockNavigate.mockClear();

  await userEvent.click(screen.getByRole("button", { name: "Search" }));
  await userEvent.type(screen.getByPlaceholderText("Search movies"), "zzzz-not-a-title");
  await userEvent.click(screen.getByRole("button", { name: "Submit movie search" }));

  expect(appStore.getState().gpt.showTitleSearch).toBe(true);
  expect(appStore.getState().gpt.titleSearchResults).toEqual([]);
  expect(appStore.getState().gpt.titleSearchError).toBeNull();
  expect(mockNavigate).toHaveBeenCalledWith("/browse");
});
