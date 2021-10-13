import { useForm } from "react-hook-form";
import zxcvbn from "zxcvbn";
import { createUser } from "../../utils/firebase-utils/api";

const SignUpForm = () => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data) => {
    if (data.password === data.confirmationPassword) {
      await createUser(data.email, data.password);
      console.log("user created");
      setValue("displayName", "", { shouldValidate: true });
      setValue("email", "", { shouldValidate: true });
      setValue("password", "", { shouldValidate: true });
      setValue("confirmationPassword", "", { shouldValidate: true });
    } else {
      console.log("passwords do not match");
    }
  };

  const onError = (error) => {
    console.log("ERROR");
    console.log(error);
  };

  const passwordCheck = (e) => {
    const password = e.target.value;
    const { score: passwordScore } = zxcvbn(password);
    if (passwordScore === 4) {
      //do something
    } else if (passwordScore === 3) {
      //do something
    } else {
      //do something
    }
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
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <label>
          Display Name:
          <input
            type="text"
            {...register("displayName", registerOptions.displayName)}
          />
        </label>
        <label>
          Email:
          <input type="text" {...register("email", registerOptions.email)} />
        </label>
        <label>
          Password:
          <input
            onInput={passwordCheck}
            type="password"
            {...register("password", registerOptions.password)}
          />
          Confirm Password:
          <input
            type="password"
            {...register(
              "confirmationPassword",
              registerOptions.confirmationPassword
            )}
          />
        </label>
        <input type="submit" value="submit" />
      </form>
    </div>
  );
};

export default SignUpForm;