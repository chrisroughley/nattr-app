import { index } from "../../utils/algolia";

import { useForm } from "react-hook-form";
import { useState } from "react";

import { sendFriendRequest } from "../../utils/firebaseUtils";

import { useSelector } from "react-redux";

const FriendsSearch = () => {
  const user = useSelector((state) => state.user.user);
  const friends = useSelector((state) => state.friends.friends);
  const { register, handleSubmit } = useForm();
  const [searchResults, setSearchResults] = useState([]);

  const onSubmit = async (data) => {
    const result = await index.search(data.friendSearch);
    console.log(result.hits);
    setSearchResults(result.hits);
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

  const registerOptions = {
    friendSearch: { required: "missing friend search" },
  };

  return (
    <div>
      <h1>Friend Search</h1>
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
              {/* check if user is already in the friend list collection to prevent sending request to an existing friend */}
              {friends.every((friend) => friend.userId !== result.objectID) ? (
                <button
                  onClick={() => {
                    handleAddFriend(result.objectID);
                  }}
                >
                  add friend
                </button>
              ) : (
                <p>friend</p>
              )}
            </ul>,
          ];
        })}
      </li>
    </div>
  );
};

export default FriendsSearch;
