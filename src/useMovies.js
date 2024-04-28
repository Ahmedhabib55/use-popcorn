import { useState, useEffect } from "react";

const KEY = "f84fc31d";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(
    function () {
      // handleCallback?.()
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setErrorMessage("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went worng with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movies not found");
          setMovies(data.Search);
          setErrorMessage("");
        } catch (err) {
          if (err.message !== "AbortError") {
            setErrorMessage(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setErrorMessage("");
        return;
      }
      fetchMovies();
      // handleCloseMovie();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, errorMessage };
}
