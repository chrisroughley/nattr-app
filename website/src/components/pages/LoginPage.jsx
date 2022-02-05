import { Link } from "react-router-dom";

import { useState } from "react";

import SignUpForm from "../layouts/SignUpform";
import SignInForm from "../layouts/SignInForm";

import "../../styles/main.css";

const LoginPage = () => {
  const [overlayPosition, setOverlayPosition] = useState("overlay-left");

  const toggleOverlay = () => {
    if (overlayPosition === "overlay-left") {
      setOverlayPosition("overlay-right");
    } else {
      setOverlayPosition("overlay-left");
    }
  };

  return (
    <div>
      <div className="login-form-container">
        <SignUpForm></SignUpForm>
        <SignInForm></SignInForm>
        <div className={`overlay-container ${overlayPosition}`}>
          <button onClick={toggleOverlay}>TOGGLE OVERLAY</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
