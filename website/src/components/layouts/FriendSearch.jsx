import { index } from "../../utils/algolia.config";

import { useForm } from "react-hook-form";
import { useState } from "react";

import { sendFriendRequest } from "../../utils/firebaseFirestoreUtils";
import { getPendingFriendRequests } from "../../utils/firebaseFirestoreUtils";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedPanel } from "../../store/slices/listPanelSlice";

import "../../styles/friendSearchStyles.css";

const FriendSearch = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const friends = useSelector((state) => state.friends.friends);
  const { register, handleSubmit } = useForm();
  const [searchResults, setSearchResults] = useState([]);

  const onSubmit = async (data) => {
    const result = await index.search(data.friendSearch);
    const resultIncludingPendingRequests = await Promise.all(
      result.hits.map(async (hit) => {
        const pendingFriendRequests = await getPendingFriendRequests(
          hit.objectID
        );
        return { ...hit, pendingFriendRequests };
      })
    );
    console.log("RESULT: ", resultIncludingPendingRequests);
    setSearchResults(resultIncludingPendingRequests);
  };

  const onError = (error) => {
    if (error.friendSearch.message === "missing friend search") {
      setSearchResults([]);
    }
    console.log("ERROR: ", error);
  };

  const handleAddFriend = async (userId) => {
    await sendFriendRequest(user.userId, userId, user.displayName);
  };

  const handleSetPanel = () => {
    dispatch(setSelectedPanel("friendsList"));
  };

  const registerOptions = {
    friendSearch: { required: "missing friend search" },
  };

  return (
    <div className="friend-search-container">
      <h2>Friend Search</h2>
      <button onClick={handleSetPanel}>friends list</button>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <label>
          <input
            type="text"
            {...register("friendSearch", registerOptions.friendSearch)}
          />
        </label>
        <input type="submit" value="search" />
      </form>
      <li>
        {searchResults.flatMap((result) => {
          if (user.userId === result.objectID) return [];
          return [
            <ul key={result.objectID}>
              <p>display name: {result.displayName}</p>
              {/* check if user is already in the friend list collection*/}
              {friends.find((friend) => friend.userId === result.objectID) ? (
                <p>friend</p>
              ) : //check if an invite has already been sent
              result.pendingFriendRequests.includes(user.userId) ? (
                <p>pending response</p>
              ) : (
                //else display add friend option
                <button
                  onClick={() => {
                    handleAddFriend(result.objectID);
                  }}
                >
                  add friend
                </button>
              )}
            </ul>,
          ];
        })}
      </li>
    </div>
  );
};

export default FriendSearch;
