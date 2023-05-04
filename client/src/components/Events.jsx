// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { useState, useEffect } from "react";

// EventInput component provides the input needed and the logic
// for the Event page
function EventInput({ name }) {
  // Hooks
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [org, setOrg] = useState("");

  // Hooks for displaying custom messages for the Reminders form
  const [showMessage, setShowMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  // Event Handlers
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleOrganizationChange = (event) => {
    setOrg(event.target.value);
  };

  const handleAddReminder = (event) => {
    // console.log("displaying message");
    // console.log(name);
    if (name === null || name === "") {
      return;
    }
    event.preventDefault();
    console.log(title, description, org);
    // POST request
    fetch(`/add-event/${name}`, {
      method: "POST",
      body: JSON.stringify({ title, description, org }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle the response data here
        setTitle("");
        setDescription("");
        setOrg("");
        setServerMessage(data.message);
        if (
          data.message === "User not found" ||
          data.message === "Org not found" ||
          data.message === "Not the leader of the organization"
        ) {
          setMessageStatus("error");
          console.log("messageStatus:", messageStatus);
          console.log("serverMessage:", serverMessage);
        } else {
          setMessageStatus("success");
        }
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 5000); // Message disappears after 5 seconds
      })
      .catch((err) => {
        console.error(err);
        setServerMessage("Error fetching reminders");
      });
  };

  // Returning JSX code
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        className="flex flex-col bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-8 
        w-full max-w-xl"
        onSubmit={handleAddReminder}
      >
        <h1 className="font-bold text-4xl text-gray-600 ">Create an Event</h1>
        <p className="font-medium text-md my-2">
          This will send a text message to your entire organization
        </p>
        <p className="font-medium text-md my-2">
          Make sure you answer every field
        </p>
        <div className="my-1 flex flex-col mb-2">
          <label className="font-bold my-1 text-sm">Title of Event</label>
          <input
            type="text"
            placeholder="Enter Event"
            className="border border-gray-300 p-1 pl-4"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="my-1 flex flex-col mb-2">
          <label className="font-bold my-1 text-sm">Description</label>
          <input
            type="text"
            placeholder="Enter description"
            className="border border-gray-300 p-1 pl-4"
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </div>
        <div className="my-1 flex flex-col mb-2">
          <label className="font-bold my-1 text-sm">Organization</label>
          <input
            type="text"
            placeholder="Enter organization"
            className="border border-gray-300 p-1 pl-4"
            value={org}
            onChange={handleOrganizationChange}
            required
          />
        </div>
        <div className="my-1 flex flex-col mb-2">
          <button
            className="border rounded-md mt-3 px-6 py-2 bg-blue-600 text-white
             font-medium transition duration-300 ease-in-out hover:bg-blue-600 "
            type="submit"
          >
            Create Event
          </button>
        </div>
      </form>
      {showMessage && messageStatus === "success" && (
        <div className="font-bold text-md text-gray-600 mt-3 mx-8">
          {serverMessage}
        </div>
      )}
      {showMessage && messageStatus === "error" && (
        <div className="font-bold text-md text-gray-600 mt-3 mx-8">
          {serverMessage}
        </div>
      )}
    </div>
  );
}

function Events({ name }) {
  return (
    <div>
      <EventInput name={name} />
    </div>
  );
}

export default Events;
