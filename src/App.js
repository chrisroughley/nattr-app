import "./App.css";

import { useEffect, useState } from "react";

import { Route, Switch, Redirect } from "react-router-dom";

import { auth } from "./utils/firebase";
import { onAuthStateChanged } from "@firebase/auth";

import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/pages/LoginPage";
import AccountManagementPage from "./components/pages/AccountManagementPage";
import MessengerPage from "./components/pages/MessengerPage";
import VideoChatPage from "./components/pages/VideoChatPage";
import BadURLPage from "./components/pages/BadURLPage";

import { useDispatch, useSelector } from "react-redux";
import { getUserById, setIsLogged } from "./state/slices/userSlice";

function App() {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.user.isLogged);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setIsLogged(true));
        dispatch(getUserById(user.uid));
      }
      setIsInitialized(true);
    });
  }, []);

  return (
    <div className="App">
      {isInitialized ? (
        <Switch>
          <Route exact path="/">
            {isLogged ? <Redirect to="/messenger" /> : <LandingPage />}
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/account">
            <AccountManagementPage />
          </Route>
          <Route exact path="/messenger">
            <MessengerPage />
          </Route>
          <Route exact path="/video">
            <VideoChatPage />
          </Route>
          <Route>
            <BadURLPage />
          </Route>
        </Switch>
      ) : (
        <div>initializing</div>
      )}
    </div>
  );
}

export default App;
