import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import MovieCard from "./MovieCard";
import movieDetailReducer from "../utils/movieDetailSlice";
import { IMG_CDN_URL } from "../utils/constants";

const renderWithStore = (ui) => {
  const appStore = configureStore({
    reducer: {
      movieDetail: movieDetailReducer,
    },
  });

  return render(<Provider store={appStore}>{ui}</Provider>);
};

describe("MovieCard", () => {
  test("renders the poster image with the expected src and alt text", () => {
    renderWithStore(<MovieCard movieId={1} posterPath="/poster.jpg" title="Inception" />);

    const image = screen.getByRole("img", { name: "Inception" });

    expect(image).toHaveAttribute("src", IMG_CDN_URL + "/poster.jpg");
    expect(image).toHaveAttribute("alt", "Inception");
  });

  test("renders gracefully when posterPath is missing", () => {
    const { container } = renderWithStore(<MovieCard movieId={1} posterPath={null} title="Missing Poster" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
