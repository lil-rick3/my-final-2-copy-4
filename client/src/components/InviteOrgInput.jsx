// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { useState, useEffect } from "react";

// InviteOrgInput component provides all the UI, and interactivity
// to get allow users to invite friends to their organizations
function InviteOrgInput({ name }) {
  // Hooks needed
  const [organization, setOrganization] = useState("");
  const [friend, setFriend] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  // Handlers
  const handleOrganizationChange = (event) => {
    setOrganization(event.target.value);
  };

  const handleFriendChange = (event) => {
    setFriend(event.target.value);
  };

  const handleInviteOrganization = (event) => {
    console.log("displaying message");
    console.log(name);
    if (name === null || name === "") {
      return;
    }
    event.preventDefault();
    console.log(organization);
    // POST request
    fetch(`/invite-org/${name}`, {
      method: "POST",
      body: JSON.stringify({ organization, friend }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setServerMessage(data.message);
        setOrganization("");
        setFriend("");
        setTimeout(() => {
          setServerMessage("");
        }, 5000);
      })
      .catch((err) => {
        console.log("Error!");
      });
  };

  // Returning JSX code
  return (
    <div>
      <form onSubmit={handleInviteOrganization} className="">
        <div className="flex flex-row mt-3 mb-2 mx-8">
          <div className="flex flex-col">
            <label className="font-bold my-1 text-sm">Organization</label>
            <input
              type="text"
              placeholder="Enter organization"
              className="border border-gray-300 p-1 pl-4 pr-10"
              onChange={handleOrganizationChange}
              value={organization}
              required
            />
          </div>
          <div className="flex flex-col ml-4">
            <label className="font-bold my-1 text-sm">Friend</label>
            <input
              type="text"
              placeholder="Enter friend"
              className="border border-gray-300 p-1 pl-4 pr-10"
              onChange={handleFriendChange}
              value={friend}
              required
            />
          </div>
          <button
            className="bg-blue-700 text-white rounded-md ml-4 
            mt-6 h-11 px-3"
            type="submit"
          >
            Invite Friend
          </button>
        </div>
      </form>
      {serverMessage !== "" && (
        <div className="font-bold text-md text-gray-600 mt-6 mx-8">
          {serverMessage}
        </div>
      )}
    </div>
  );
}

export default InviteOrgInput;
