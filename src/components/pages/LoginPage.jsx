import { Link } from "react-router-dom";

import SignUpForm from "../templates/SignUpform";

const LoginPage = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <Link to="/account">Account Management</Link>
      <Link to="/messenger">Messenger</Link>
      <SignUpForm></SignUpForm>
    </div>
  );
};

export default LoginPage;
