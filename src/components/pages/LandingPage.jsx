import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "../../state/slices/counterSlice";
import { getUserById } from "../../state/slices/userSlice";

import DevComponent from "../DevComponent";

const LandingPage = () => {
  const count = useSelector((state) => state.counter.value);
  const user = useSelector((state) => state.user.user);
  const userLoading = useSelector((state) => state.user.loading);
  const userError = useSelector((state) => state.user.error);
  const dispatch = useDispatch();
  console.log("hello");
  return (
    <div>
      <h1>Landing Page</h1>
      <Link to="/login">Login</Link>

      <DevComponent></DevComponent>
    </div>
  );
};

export default LandingPage;
