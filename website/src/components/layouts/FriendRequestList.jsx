import { useSelector } from "react-redux";

import {
  acceptFriendRequest,
  initializeChat,
  rejectFriendRequest,
} from "../../utils/firebaseFirestoreUtils";

import "../../styles/friendRequestListStyles.css";

const FriendRequestList = () => {
  const friendRequests = useSelector(
    (state) => state.friendRequests.friendRequests
  );
  const user = useSelector((state) => state.user.user);

  const handleAcceptRequest = async (userId, displayName) => {
    await acceptFriendRequest(
      user.userId,
      userId,
      user.displayName,
      displayName
    );
    await initializeChat(
      [
        { userId, displayName },
        { userId: user.userId, displayName: user.displayName },
      ],
      "friend"
    );
  };

  const handleRejectRequest = (userId) => {
    rejectFriendRequest(user.userId, userId);
  };

  return (
    <div className={"friend-request-list-container"}>
      <h2>Friend Requests</h2>
      <ul className={"friend-request-list"}>
        {friendRequests.map((friendRequest) => {
          return (
            <li key={friendRequest.userId}>
              <p>{friendRequest.displayName}</p>
              <button
                onClick={() => {
                  handleAcceptRequest(
                    friendRequest.userId,
                    friendRequest.displayName
                  );
                }}
              >
                accept request
              </button>
              <button
                onClick={() => {
                  handleRejectRequest(friendRequest.userId);
                }}
              >
                decline request
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FriendRequestList;
