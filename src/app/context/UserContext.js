'use client'
import { createContext, useContext, useReducer, useEffect } from "react";

const UserContext = createContext();

const initialUserState = {
  user: null, // Start with null to indicate no user is logged in
};

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("/api/users/me", {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("dataa",data)
          if (data.success) {
            dispatch({ type: "LOGIN", payload: data.data });
          }
        })
        .catch((err) => {
          console.error("Token verification failed:", err);
          // Optionally, remove the token if it's invalid
          localStorage.removeItem("token");
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
