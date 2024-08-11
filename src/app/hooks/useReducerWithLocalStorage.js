import { useEffect, useReducer } from "react";

export default function useReducerWithLocalStorage(
  reducer,
  initialState,
  storageKey
) {
  const isBrowser = typeof window !== "undefined";

  const [storedState, dispatch] = useReducer(
    reducer,
    initialState,
    (initialState) => {
      if (isBrowser) {
        try {
          const persisted = window.localStorage.getItem(storageKey);
          return persisted ? JSON.parse(persisted) : initialState;
        } catch (error) {
          console.log(error);
          return initialState;
        }
      } else {
        return initialState;
      }
    }
  );

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem(storageKey, JSON.stringify(storedState));
    }
  }, [storedState, isBrowser]);

  return [storedState, dispatch];
}
