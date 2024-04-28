import { useEffect } from "react";

export function useListenFor(listen, callback) {
  useEffect(
    function () {
      function addEventListener(e) {
        if (e.code.toLowerCase() === listen.toLowerCase()) {
          // onCloseMovie();
          callback();
        }
      }
      document.addEventListener("keydown", addEventListener);
      return function () {
        document.removeEventListener("keydown", addEventListener);
      };
    },
    [listen, callback]
  );
}
