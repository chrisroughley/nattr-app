import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  signInUserWithEmail,
  signInWithSocial,
} from "../../utils/firebaseFirestoreUtils";

import { useDispatch } from "react-redux";
import { getUserById } from "../../state/slices/userSlice";

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
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <label>
          Email
          <input type="text" {...register("email", registerOptions.email)} />
        </label>
        <label>
          Password
          <input
            type="password"
            {...register("password", registerOptions.password)}
          />
        </label>
        <input type="submit" value="submit" />
      </form>
      <button
        onClick={() => {
          handleSocialSignIn("google");
        }}
      >
        sign in with google
      </button>
      <button
        onClick={() => {
          handleSocialSignIn("facebook");
        }}
      >
        sign in with facebook
      </button>
    </div>
  );
};

export default SignInForm;
