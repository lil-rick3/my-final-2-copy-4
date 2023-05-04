// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { useState, useEffect } from "react";

// LeaveOrgInput provides the UI and interactivity,
// to be able to leave a Organization if the user is part of it
function LeaveOrgInput({ name }) {
  // hooks
  const [organization, setOrganization] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  // handlers
  const handleOrganizationChange = (event) => {
    setOrganization(event.target.value);
  };

  const handleLeaveOrganization = (event) => {
    console.log("displaying message");
    console.log(name);
    if (name === null || name === "") {
      return;
    }
    event.preventDefault();
    console.log(organization);
    // POST request
    fetch(`/leave-org/${name}`, {
      method: "POST",
      body: JSON.stringify({ organization }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setServerMessage(data.message);
        setOrganization("");
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
      <form onSubmit={handleLeaveOrganization} className="">
        <div className="my-1 flex flex-col mt-3 mb-2 mx-8 max-w-md">
          <label className="font-bold my-1 text-sm">Organization</label>
          <div className="flex flex-row">
            <input
              type="text"
              placeholder="Enter organization"
              className="border border-gray-300 p-1 pl-4 pr-10"
              onChange={handleOrganizationChange}
              required
            />
            <button
              className="bg-blue-700 text-white rounded-md ml-4 px-2 py-2"
              type="submit"
            >
              Leave Organization
            </button>
          </div>
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

export default LeaveOrgInput;
