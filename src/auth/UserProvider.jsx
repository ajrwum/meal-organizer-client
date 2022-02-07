import { useState, useEffect } from "react";
import UserContext from "./UserContext";
import apiHandler from "../api/apiHandler";

const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    currentUser: null,
    isLoading: true,
    isLoggedIn: false,
  });

  useEffect(() => {
    authenticateUser();
  }, []);

  const authenticateUser = () => {
    apiHandler
      .isLoggedIn()
      .then((user) => {
        setAuth({ currentUser: user, isLoading: false, isLoggedIn: true });
      })
      .catch((err) => {
        console.error(err);
        setAuth({
          currentUser: null,
          isLoading: false,
          isLoggedIn: false,
        });
      });
  };

  const removeUser = () => {
    apiHandler.signout().finally(() =>
      setAuth({
        currentUser: null,
        isLoading: false,
        isLoggedIn: false,
      })
    );
  };

  const authValues = {
    currentUser: auth.currentUser,
    isLoading: auth.isLoading,
    isLoggedIn: auth.isLoggedIn,
    removeUser,
    authenticateUser,
  };

  return (
    <UserContext.Provider value={authValues}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
