import { useEffect } from "react";

import { Route, Routes, Navigate } from "react-router-dom";

import { auth } from "./utils/firebase.config";
import { onAuthStateChanged } from "@firebase/auth";
import { handlePresence } from "./utils/firebaseRealtimeDatabaseUtils";

import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/pages/LoginPage";
import AccountManagementPage from "./components/pages/AccountManagementPage";
import MessengerPage from "./components/pages/MessengerPage";
import VideoChatPage from "./components/pages/VideoChatPage";
import BadURLPage from "./components/pages/BadURLPage";

import { useDispatch, useSelector } from "react-redux";
import { setIsLogged, setIsInitialized } from "./store/slices/userSlice";
import { getUserById } from "./store/thunks";

//update root --app-height style for mobile devices. Prevents UI glitches when native mobile url and nav bars are hidden
const appHeight = () => {
  document.documentElement.style.setProperty(
    "--app-height",
    `${window.innerHeight}px`
  );
};
appHeight();

window.addEventListener("resize", appHeight);

function App() {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.user.isLogged);
  const isInitialized = useSelector((state) => state.user.isInitialized);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setIsLogged(true));
        dispatch(getUserById(user.uid));
        handlePresence();
      } else {
        dispatch(setIsInitialized(true));
      }
    });
  }, [dispatch]);

  return (
    <div>
      {isInitialized ? (
        <Routes>
          <Route
            path="/"
            element={
              isLogged ? <Navigate replace to="/messenger" /> : <LandingPage />
            }
          />
          <Route
            path="/login"
            element={
              isLogged ? <Navigate replace to="/messenger" /> : <LoginPage />
            }
          />
          <Route
            path="/account"
            element={
              isLogged ? <AccountManagementPage /> : <Navigate replace to="/" />
            }
          />
          <Route
            path="/messenger"
            element={isLogged ? <MessengerPage /> : <Navigate replace to="/" />}
          />
          <Route
            path="/video"
            element={isLogged ? <VideoChatPage /> : <Navigate replace to="/" />}
          />
          <Route path="*" element={<BadURLPage />} />
        </Routes>
      ) : (
        <div>initializing</div>
      )}
    </div>
  );
}

export default App;
