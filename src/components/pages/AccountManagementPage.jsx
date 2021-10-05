import { useHistory } from "react-router";

const AccountManagementPage = () => {
  const history = useHistory();
  return (
    <div>
      <h1>Account Management Page</h1>
      <button onClick={history.goBack}>Go back</button>
    </div>
  );
};

export default AccountManagementPage;
