import { index } from "../../utils/algolia";

import { useForm } from "react-hook-form";
import { useState } from "react";

import { db } from "../../utils/firebase";
import { setDoc, doc, serverTimestamp } from "@firebase/firestore";

import { useSelector } from "react-redux";

const FriendsSearch = () => {
  const user = useSelector((state) => state.user.user);
  const { register, handleSubmit, setValue } = useForm();
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
    const pendingFriendRequestRef = doc(
      db,
      "users",
      userId,
      "pendingFriendRequests",
      user.userId
    );
    await setDoc(
      pendingFriendRequestRef,
      {
        userId: user.userId,
        displayName: user.displayName,
        requestDate: serverTimestamp(),
      },
      { merge: true }
    );
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
        {searchResults.map((result) => {
          if (user.userId === result.objectID) return;
          return (
            <ul key={result.objectID}>
              <p>display name: {result.displayName}</p>
              <button
                onClick={() => {
                  handleAddFriend(result.objectID);
                }}
              >
                add friend
              </button>
            </ul>
          );
        })}
      </li>
    </div>
  );
};

export default FriendsSearch;
