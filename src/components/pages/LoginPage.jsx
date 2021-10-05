import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <Link to="/account">Account Management</Link>
      <Link to="/messenger">Messenger</Link>
    </div>
  );
};

export default LoginPage;
