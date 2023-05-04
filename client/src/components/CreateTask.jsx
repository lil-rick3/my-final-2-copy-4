// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { useState, useEffect } from "react";

// Dropdown component will provide the users that belong
// to an organization
function DropDown({ data, onRecipientChange }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    onRecipientChange(event.target.value);
  };

  return (
    <div className="relative inline-flex">
      <div className="my-1 flex flex-col mb-2">
        <label className="font-bold my-1 text-sm">Recipient</label>
        <select
          value={selectedOption}
          onChange={handleChange}
          className="border-t border-b border-l border-r text-gray-800 border-gray-200 bg-white appearance-none h-full w-full py-2 px-4 pr-8 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select user</option>
          {data.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function TaskInput({ name }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isUserLeader, setIsUserLeader] = useState(false);
  const [people, setPeople] = useState([]);

  // Hooks for displaying custom messages for the Reminders form
  const [showMessage, setShowMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  // Data Handlers
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleRecipientChange = (selectedValue) => {
    setRecipient(selectedValue);
  };

  // GET request
  useEffect(() => {
    fetch(`/get-names-orgs/${name}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.orgUsers.length === 0) {
          setIsUserLeader(false);
          setServerMessage(
            `Hi ${name} you are currently not the leader of any organization`
          );
        } else {
          setIsUserLeader(true);
          setPeople(data.orgUsers);
        }
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
        setServerMessage("Error at fetching data");
      });
  }, []);

  // Handler for adding task
  const handleAddReminder = (event) => {
    // console.log("displaying message");
    // console.log(name);
    if (name === null || name === "") {
      return;
    }
    event.preventDefault();
    // POST request
    fetch(`/add-task/${name}`, {
      method: "POST",
      body: JSON.stringify({ title, description, recipient }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle the response data here
        setTitle("");
        setDescription("");
        setRecipient("");
        setServerMessage(data.message);
        if (
          data.message === "User not found" ||
          data.message === "Recipient not found"
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
        <h1 className="font-bold text-4xl text-gray-600 ">Create a Task</h1>
        <p className="font-medium text-md">Make sure you answer every field</p>
        <div className="my-1 flex flex-col mb-2">
          <label className="font-bold my-1 text-sm">Title of Task</label>
          <input
            type="text"
            placeholder="Enter title"
            className="border border-gray-300 p-1 pl-4"
            value={title}
            onChange={handleTitleChange}
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
          />
        </div>
        {isUserLeader && (
          <DropDown data={people} onRecipientChange={handleRecipientChange} />
        )}
        <div className="my-1 flex flex-col mb-2">
          <button
            className="border rounded-md mt-3 px-6 py-2 bg-blue-600 text-white
             font-medium transition duration-300 ease-in-out hover:bg-blue-600 "
            type="submit"
          >
            Create Task
          </button>
        </div>
      </form>
      {showMessage && messageStatus === "success" && (
        <div className="text-green-500 font-medium text-md mt-3">
          {serverMessage}
        </div>
      )}
      {showMessage && messageStatus === "error" && (
        <div className="text-red-500 font-medium text-md mt-3">
          {serverMessage}
        </div>
      )}
    </div>
  );
}

// CreateTask is the main component of this file
function CreateTask({ name }) {
  return (
    <div>
      <TaskInput name={name} />
    </div>
  );
}

export default CreateTask;
