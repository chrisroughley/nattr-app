import { useForm } from "react-hook-form";
import { useHistory } from "react-router";

import { signInUser } from "../../utils/firebaseUtils";

import { useDispatch } from "react-redux";
import { getUserById } from "../../state/slices/userSlice";

const SignInForm = () => {
  const history = useHistory();
  const { register, handleSubmit, setValue } = useForm();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    const userId = await signInUser(data.email, data.password);
    if (!userId.error) {
      dispatch(getUserById(userId));
      setValue("email", "", { shouldValidate: true });
      setValue("password", "", { shouldValidate: true });
      history.push("/messenger");
    }
  };

  const onError = (error) => {
    console.log("SIGN IN FORM ERROR: ", error);
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
    </div>
  );
};

export default SignInForm;
