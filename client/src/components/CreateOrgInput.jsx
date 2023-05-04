// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { useState, useEffect } from "react";

// CreateOrgInput is a component that will provide
// the input fro creating an organization logic
function CreateOrgInput({ name }) {
  // Hooks needed
  const [organization, setOrganization] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  // Events handlers
  const handleOrganizationChange = (event) => {
    setOrganization(event.target.value);
  };

  const handleAddOrganization = (event) => {
    console.log("displaying message");
    console.log(name);
    if (name === null || name === "") {
      return;
    }
    event.preventDefault();
    console.log(organization);
    // POST request
    fetch(`/create-org/${name}`, {
      method: "POST",
      body: JSON.stringify({ name, organization }),
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
      <form onSubmit={handleAddOrganization} className="">
        <div className="my-1 flex flex-col mt-3 mb-2 mx-8 max-w-sm">
          <label className="font-bold my-1 text-sm">Organization</label>
          <div className="flex flex-row">
            <input
              type="text"
              placeholder="Enter organization"
              className="border border-gray-300 p-1 pl-4 pr-10"
              onChange={handleOrganizationChange}
              value={organization}
              required
            />
            <button
              className="bg-blue-700 text-white rounded-md ml-4 py-2 px-4"
              type="submit"
            >
              Create
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

export default CreateOrgInput;
