import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  signInUserWithEmail,
  signInWithSocial,
} from "../../utils/firebaseFirestoreUtils";

import { useDispatch } from "react-redux";
import { getUserById } from "../../store/thunks";

import "../../styles/main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SignInForm = ({ toggleOverlay }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    const userId = await signInUserWithEmail(data.email, data.password);
    if (!userId.error) {
      setValue("email", "", { shouldValidate: true });
      setValue("password", "", { shouldValidate: true });
      dispatch(getUserById(userId));
      navigate("/messenger");
    }
  };

  const onError = (error) => {
    console.log("SIGN IN FORM ERROR: ", error);
  };

  const handleSocialSignIn = async (authProvider) => {
    const userId = await signInWithSocial(authProvider);
    if (!userId.error) {
      dispatch(getUserById(userId));
      navigate("/messenger");
    }
  };

  const registerOptions = {
    email: {
      required: "missing email",
    },
    password: {
      required: "missing password",
    },
  };

  return (
    <div className="sign-in-form-container">
      <h2>Natter</h2>
      {/* <h3>using email and password</h3> */}
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <input
          className="form-input-field"
          type="text"
          placeholder="Email"
          {...register("email", registerOptions.email)}
        />
        <input
          className="form-input-field"
          type="password"
          placeholder="Password"
          {...register("password", registerOptions.password)}
        />
        <div className="login-options-container">
          <p>Forgot password?</p>
          <p
            onClick={() => {
              toggleOverlay();
            }}
          >
            Register
          </p>
        </div>
        <input className="submit-button" type="submit" value="Log in" />
      </form>
      <h3>or log in using</h3>
      <div className="social-sign-in-container">
        <button
          className="social-buttons"
          onClick={() => {
            handleSocialSignIn("google");
          }}
        >
          <img
            className="social-icon"
            src="https://img.icons8.com/fluency/48/000000/google-logo.png"
          />
        </button>
        <button
          className="social-buttons"
          onClick={() => {
            handleSocialSignIn("facebook");
          }}
        >
          <img
            className="social-icon"
            src="https://img.icons8.com/fluency/48/000000/facebook-new.png"
          />
        </button>
        <button className="social-buttons">
          <img
            className="social-icon"
            src="https://img.icons8.com/ios-filled/50/000000/mac-os.png"
          />
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
