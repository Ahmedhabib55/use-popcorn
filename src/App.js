import { useEffect, useRef, useState } from "react";
import StarsRating from "./StarsRating";
import { useMovies } from "./useMovies";
import { useLocalStroageState } from "./useLocalStroageState";
import { useListenFor } from "./useListenFor";
/*
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
*/
const KEY = "f84fc31d";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("inc");
  const [selectId, setSelectId] = useState(null);
  // const [watched, setWatched] = useState(function () {
  //   const storedMovies = localStorage.getItem("watched");
  //   return JSON.parse(storedMovies);
  // });
  const [watched, setWatched] = useLocalStroageState([], "watched");
  const { movies, isLoading, errorMessage } = useMovies(query);
  function handleSelectedId(id) {
    setSelectId((selectId) => (id === selectId ? null : id));
  }

  function handleCloseMovie() {
    setSelectId(null);
  }

  // function for add movie to list watched movies
  function handleAddWatchedToList(movie) {
    // setWatched([...watched, movie])
    setWatched((watched) => [...watched, movie]);
  }

  // function for handle deleting movie form watched array
  function handleDeletMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavaBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumReslut movies={movies} />
      </NavaBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <ListMovies movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !errorMessage && (
            <ListMovies movies={movies} onSelect={handleSelectedId} />
          )}
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </Box>

        <Box>
          {selectId ? (
            <MovieDetails
              selectId={selectId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedList={handleAddWatchedToList}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <MoviesList watched={watched} onDeletMovie={handleDeletMovie} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function NavaBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useListenFor("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.foucs();
    setQuery("");
  });
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function NumReslut({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length ? movies.length : 0}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function ListMovies({ movies, onSelect }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => onSelect(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function MoviesList({ watched, onDeletMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
            <button
              className="btn-delete"
              onClick={() => onDeletMovie(movie.imdbID)}
            >
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Loader() {
  return <p className="loader">loading...</p>;
}

function ErrorMessage({ errorMessage }) {
  return (
    <div className="loader">
      <span>⛔️</span>
      {errorMessage}
    </div>
  );
}

function MovieDetails({ selectId, onCloseMovie, onAddWatchedList, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const countRef = useRef(0);
  // useEffect(
  //   function () {
  //     function doEscape(e) {
  //       if (e.code === "Escape") {
  //         onCloseMovie();
  //       }
  //     }
  //     document.addEventListener("keydown", doEscape);
  //     return function () {
  //       document.removeEventListener("keydown", doEscape);
  //     };
  //   },
  //   [onCloseMovie]
  // );
  useListenFor("Escape", onCloseMovie);
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectId}`
        );
        const newMovie = await res.json();
        setMovie(newMovie);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectId]
  );

  // use Effect for count of decision from user
  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectId
  )?.userRating;
  const {
    Title: title,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    imdbRating,
    Plot: plot,
    Actors: actors,
    Director: director,
    imdbID,
  } = movie;

  // function for add watched movies to list but specfic data
  function handleAdd() {
    const newMovie = {
      imdbID: selectId,
      poster,
      title,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecision: countRef.current,
    };
    onAddWatchedList(newMovie);
    setTimeout(() => onCloseMovie(), 500);
  }

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie| ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        Loader
      ) : (
        <>
          <header key={imdbID}>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>
                  you are rated with<em> {watchedUserRating} </em>
                  <span>⭐</span>
                </p>
              ) : (
                <>
                  <StarsRating
                    numStar={10}
                    color={"gold"}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
