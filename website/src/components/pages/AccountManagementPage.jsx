import { useNavigate } from "react-router";

const AccountManagementPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Account Management Page</h1>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        Go back
      </button>
    </div>
  );
};

export default AccountManagementPage;
