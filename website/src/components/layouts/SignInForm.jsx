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

const SignInForm = () => {
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
      <h1>Sign In</h1>
      <div className="social-sign-in-container">
        <button
          className="social-buttons"
          onClick={() => {
            handleSocialSignIn("google");
          }}
        >
          <FontAwesomeIcon
            icon={["fab", "google-plus-g"]}
            size="lg"
            color="#000000"
          />
        </button>
        <button
          className="social-buttons"
          onClick={() => {
            handleSocialSignIn("facebook");
          }}
        >
          <FontAwesomeIcon
            icon={["fab", "facebook-f"]}
            size="lg"
            color="#000000"
          />
        </button>
      </div>
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
        <input className="submit-button" type="submit" value="SIGN IN" />
      </form>
    </div>
  );
};

export default SignInForm;
