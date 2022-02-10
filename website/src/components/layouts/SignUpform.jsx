import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { useDispatch } from "react-redux";
import { getUserById } from "../../store/thunks";

import zxcvbn from "zxcvbn";

import { createUserWithEmail } from "../../utils/firebaseFirestoreUtils";

import "../../styles/main.css";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const dispatch = useDispatch();

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data) => {
    if (data.password === data.confirmationPassword) {
      const userId = await createUserWithEmail(
        data.displayName,
        data.email,
        data.password
      );
      if (!userId.error) {
        dispatch(getUserById(userId));
        console.log("user created");
        setValue("displayName", "", { shouldValidate: true });
        setValue("email", "", { shouldValidate: true });
        setValue("password", "", { shouldValidate: true });
        setValue("confirmationPassword", "", { shouldValidate: true });
        navigate("/messenger");
      }
    } else {
      console.log("passwords do not match");
    }
  };

  const handleSocialSignIn = () => {};
  const onError = (error) => {
    console.log("SIGN UP FORM ERROR: ", error);
  };

  //Generate a password strength score from 0-4
  const passwordCheck = (e) => {
    const password = e.target.value;
    const { score: passwordScore } = zxcvbn(password);
    setPasswordStrength(passwordScore);
  };

  const registerOptions = {
    displayName: {
      required: "missing display name",
      minLength: { value: 2, message: "invalid display name" },
      maxLength: { value: 20, message: "invalid display name" },
    },
    email: {
      required: "missing email",
      pattern: {
        value: emailRegex,
        message: "invalid email",
      },
    },
    password: {
      required: "missing password",
      minLength: { value: 8, message: "invalid password" },
      maxLength: { value: 30, message: "invalid password" },
    },
    confirmationPassword: {
      required: "missing confirmation password",
      minLength: { value: 8, message: "invalid confirmation password" },
      maxLength: {
        value: 30,
        message: "invalid confirmation password",
      },
    },
  };

  return (
    <div className="sign-up-form-container">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <input
          className="form-input-field"
          type="text"
          {...register("displayName", registerOptions.displayName)}
          placeholder="Display Name"
        />
        <input
          className="form-input-field"
          type="text"
          {...register("email", registerOptions.email)}
          placeholder="Email"
        />
        <input
          className="form-input-field"
          onInput={passwordCheck}
          type="password"
          {...register("password", registerOptions.password)}
          placeholder="Password"
        />
        <input
          className="form-input-field"
          type="password"
          {...register(
            "confirmationPassword",
            registerOptions.confirmationPassword
          )}
          placeholder="Confirm Password"
        />
        <input className="submit-button" type="submit" value="SIGN UP" />
      </form>
      <h3>or sign up using</h3>
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

export default SignUpForm;
