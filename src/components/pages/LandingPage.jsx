import { Link } from "react-router-dom";

import DevComponent from "../DevComponent";

const LandingPage = () => {
  return (
    <div>
      <h1>Landing Page</h1>
      <Link to="/login">Login</Link>
      <DevComponent></DevComponent>
    </div>
  );
};

export default LandingPage;
