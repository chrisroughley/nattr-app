import { useNavigate } from "react-router";

const AccountManagementPage = () => {
  const { goBack } = useNavigate();
  return (
    <div>
      <h1>Account Management Page</h1>
      <button onClick={goBack}>Go back</button>
    </div>
  );
};

export default AccountManagementPage;
