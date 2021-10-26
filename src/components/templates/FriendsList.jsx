import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getFriendsByUserId } from "../../state/slices/friendsSlice";
import { setSelectedPanel } from "../../state/slices/listPanelSlice";

const FriendsList = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const friends = useSelector((state) => state.friends.friends);
  const friendRequests = useSelector(
    (state) => state.friendRequests.friendRequests
  );

  useEffect(() => {
    dispatch(getFriendsByUserId(user.userId));
  }, [user.userId]);

  const handleSetPanel = (panel) => {
    dispatch(setSelectedPanel(panel));
  };

  return (
    <div>
      <h2>Add Friends</h2>
      <button
        onClick={() => {
          handleSetPanel("friendSearch");
        }}
      >
        add friend
      </button>
      {friendRequests.length ? (
        <div>
          <h2>Friend Requests</h2>
          <button
            onClick={() => {
              handleSetPanel("friendRequests");
            }}
          >
            friend requests
          </button>
        </div>
      ) : (
        ""
      )}
      <h2>Friends List</h2>
      <ul>
        {friends.map((friend) => {
          console.log(friend);
          return <li key={friend.userId}>{friend.displayName}</li>;
        })}
      </ul>
    </div>
  );
};

export default FriendsList;
