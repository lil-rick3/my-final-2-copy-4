// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

// imports needed
import React, { useState, useEffect } from "react";
import PendingFriends from "./PendingFriends";
import ViewFriends from "./ViewFriends";

// FriendsInput will provide the html and js code needed
// to provide a functional input area for adding friends
function FriendsInput({ name }) {
  // Hooks needed
  const [friend, setFriend] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  // Event Handlers
  const handleFriendChange = (event) => {
    setFriend(event.target.value);
  };

  const handleAddFriend = (event) => {
    console.log("displaying message");
    console.log(name);
    if (name === null || name === "") {
      return;
    }
    event.preventDefault();
    console.log(friend);
    // POST request
    fetch("/sent-friend-request", {
      method: "POST",
      body: JSON.stringify({ name, friend }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setServerMessage(data.message);
        setFriend("");
        setTimeout(() => {
          setServerMessage("");
        }, 5000);
      })
      .catch((err) => {
        console.log("Error!");
      });
  };

  // Return JSX of FriendsInput
  return (
    <div>
      <form onSubmit={handleAddFriend} className="">
        <h2 className="font-medium text-3xl text-gray-600 mx-8 mt-10">
          Friends
        </h2>
        <p className="font-bold self-center text-md text-gray-700 mt-5 mx-7 max-2xl">
          In Friends section you can send friend request to users of the
          website.
        </p>
        <p className="font-bold self-center text-md text-gray-700 mt-2 mx-7 max-2xl">
          As well viewing all of your friend requests to see who you want to
          add.
        </p>
        <div className="my-1 flex flex-col mt-3 mb-2 mx-8 max-w-sm">
          <label className="font-bold my-1 text-sm">Username</label>
          <div className="flex flex-row">
            <input
              type="text"
              placeholder="Enter username"
              className="border border-gray-300 p-1 pl-4 pr-10"
              onChange={handleFriendChange}
              required
            />
            <button
              className="bg-blue-700 text-white rounded-md ml-4 py-2 px-4"
              type="submit"
            >
              Add Friend
            </button>
          </div>
        </div>
      </form>
      {serverMessage !== "" && (
        <div className="text-green-600 font-bold text-md mt-3 mx-8">
          {serverMessage}
        </div>
      )}
    </div>
  );
}

// Friends is the main component of the page, that will
// use FriendsInput, ViewFriends, PendingFriends components
// to build the page for all the friend logic
function Friends({ name }) {
  // Hooks needed
  const [listFriends, setListFriends] = useState([]);
  const [pendingTable, setPendingTable] = useState(false);
  const [friendsTable, setFriendsTable] = useState(false);

  useEffect(() => {
    // GET request
    fetch(`/get-friends/${name}`)
      .then((res) => res.json())
      .then((data) => {
        setListFriends(data.friends);
        console.log(data.friends);
      });
  }, [name]);

  // Returning JSX code
  return (
    <div>
      <FriendsInput name={name} />
      <div>
        <div>
          <p
            className="font-bold self-center text-md text-gray-700
           mt-4 mx-7 max-2xl"
          >
            Click to show whichever table you want to see:
          </p>
          <div className="flex flex-row mx-3 py-2">
            <button
              className="bg-blue-700 text-white rounded-md ml-4 px-3 py-2"
              onClick={() => {
                setPendingTable(false);
                setFriendsTable(true);
              }}
            >
              Friends
            </button>
            <button
              className="bg-blue-700 text-white rounded-md ml-4 px-3 py-2"
              onClick={() => {
                setPendingTable(true);
                setFriendsTable(false);
              }}
            >
              Pending Friends Requests
            </button>
          </div>
        </div>
        <div>
          {pendingTable && <PendingFriends name={name} />}
          {friendsTable && <ViewFriends name={name} />}
        </div>
      </div>
    </div>
  );
}

export default Friends;
