import "./App.css";

import { useEffect } from "react";

import { Route, Switch } from "react-router-dom";

import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/pages/LoginPage";
import AccountManagementPage from "./components/pages/AccountManagementPage";
import MessengerPage from "./components/pages/MessengerPage";
import VideoChatPage from "./components/pages/VideoChatPage";
import BadURLPage from "./components/pages/BadURLPage";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
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
