import { useSelector } from "react-redux";

import {
  acceptFriendRequest,
  initializeChat,
  rejectFriendRequest,
} from "../../utils/firebaseUtils";

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
    <div>
      <h2>Friend Requests</h2>
      <ul>
        {friendRequests.map((friendRequest) => {
          const friendRequestData = friendRequest.data();
          return (
            <li key={friendRequestData.userId}>
              <p>{friendRequestData.displayName}</p>
              <button
                onClick={() => {
                  handleAcceptRequest(
                    friendRequestData.userId,
                    friendRequestData.displayName
                  );
                }}
              >
                accept request
              </button>
              <button
                onClick={() => {
                  handleRejectRequest(friendRequestData.userId);
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
