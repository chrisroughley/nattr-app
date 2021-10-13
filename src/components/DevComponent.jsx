import { useSelector } from "react-redux";

const DevComponent = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div>
      <p>USER: {user.name}</p>
    </div>
  );
};

export default DevComponent;
