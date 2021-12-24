import { useEffect, useState } from "react";
import { Waypoint } from "react-waypoint";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedPanel } from "../../state/slices/listPanelSlice";

import { getFriendsByUserId, getMoreFriends } from "../../utils/firebaseUtils";

import "../../styles/friendListStyles.css";

const FriendList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [friends, setFriends] = useState([]);

  const friendRequests = useSelector(
    (state) => state.friendRequests.friendRequests
  );

  useEffect(() => {
    const asyncWrapper = async () => {
      const friendsData = await getFriendsByUserId(user.userId);
      setFriends(friendsData);
    };
    asyncWrapper();
  }, [user.userId, dispatch]);

  const handleSetPanel = (panel) => {
    dispatch(setSelectedPanel(panel));
  };

  const handleGetMoreFriends = async (lastDoc) => {
    const moreFriends = await getMoreFriends(user.userId, lastDoc);
    setFriends((friends) => [...friends, ...moreFriends]);
    console.log("here", moreFriends);
  };

  return (
    <div className={"friend-list-container"}>
      <h2>Add Friends</h2>
      <button
        onClick={() => {
          handleSetPanel("friendSearch");
        }}
      >
        search friends
      </button>
      {friendRequests.length > 0 && (
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
      )}
      <h2>Friends List</h2>
      <ul className={"friends"}>
        {friends.map((friend, index) => {
          return (
            <li key={friend.userId} className={"friend"}>
              {index === friends.length - 4 && (
                <Waypoint
                  onEnter={() => {
                    handleGetMoreFriends(
                      friends[friends.length - 1].firebaseDoc
                    );
                  }}
                />
              )}
              {friend.displayName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FriendList;
