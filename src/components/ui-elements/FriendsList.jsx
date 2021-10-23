import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getFriendsByUserId } from "../../state/slices/friendsSlice";

const FriendsList = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const friends = useSelector((state) => state.friends.friends);

  useEffect(() => {
    dispatch(getFriendsByUserId(user.userId));
  }, [user.userId]);

  return (
    <div>
      <h1>Friends List</h1>
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
