import { useForm } from "react-hook-form";
import zxcvbn from "zxcvbn";
import { createUser } from "../../utils/api/api";

const SignUpForm = () => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data, e) => {
    console.log("DATA");
    console.log(data, e);
    if (data.password === data.confirmationPassword) {
      try {
        await createUser(data.email, data.password);
        console.log("user created");
        setValue("username", "", { shouldValidate: true });
        setValue("email", "", { shouldValidate: true });
        setValue("password", "", { shouldValidate: true });
        setValue("confirmationPassword", "", { shouldValidate: true });
      } catch (err) {
        console.log(err.message);
      }
    } else {
      console.log("passwords do not match");
    }
  };

  const onError = (error, e) => {
    console.log("ERROR");
    console.log(error, e);
  };

  const passwordCheck = (password) => {
    console.log(password);
    let { score: passwordScore } = zxcvbn(password);
    console.log(passwordScore);
    if (passwordScore === 4) {
      console.log("strong");
    } else if (passwordScore === 3) {
      console.log("medium");
    } else {
      console.log("weak");
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <label>
          Username:
          <input
            type="text"
            {...register("username", {
              required: "missing username",
              minLength: { value: 2, message: "invalid username" },
              maxLength: { value: 20, message: "invalid username" },
            })}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            {...register("email", {
              required: "missing email",
              pattern: {
                value: emailRegex,
                message: "invalid email",
              },
            })}
          />
        </label>
        <label>
          Password:
          <input
            onInput={(e) => {
              passwordCheck(e.target.value);
            }}
            type="password"
            {...register("password", {
              required: "missing password",
              minLength: { value: 8, message: "invalid password" },
              maxLength: { value: 30, message: "invalid password" },
            })}
          />
          Confirm Password:
          <input
            type="password"
            {...register("confirmationPassword", {
              required: "missing confirmation password",
              minLength: { value: 8, message: "invalid confirmation password" },
              maxLength: {
                value: 30,
                message: "invalid confirmation password",
              },
            })}
          />
        </label>
        <input type="submit" value="submit" />
      </form>
    </div>
  );
};

export default SignUpForm;
