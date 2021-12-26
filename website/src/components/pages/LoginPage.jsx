import { Link } from "react-router-dom";

import SignUpForm from "../layouts/SignUpform";
import SignInForm from "../layouts/SignInForm";

const LoginPage = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <Link to="/account">Account Management</Link>
      <Link to="/messenger">Messenger</Link>
      <SignUpForm></SignUpForm>
      <SignInForm></SignInForm>
    </div>
  );
};

export default LoginPage;
