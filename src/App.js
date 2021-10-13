import "./App.css";

import { useEffect } from "react";

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
import { getUserById } from "./state/slices/userSlice";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("USER ID: ", user.uid);
        dispatch(getUserById(user.uid));
      }
    });
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          {/* {user.name ? <Redirect to="/messenger" /> : <LandingPage />} */}
          <LandingPage />
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
    </div>
  );
}

export default App;
