// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { useState, useEffect } from "react";
import ViewClosedTasks from "./ViewClosedTasks";
import ViewActiveTasks from "./ViewActiveTasks";

// viewTaskMessage component will show you a small message
// that is used for the main component ViewTasks
function ViewTaskMessage({ name }) {
  return (
    <div>
      <h1 className="font-semibold self-center text-3xl text-gray-700 mt-7 mx-7">
        Welcome to View Tasks
      </h1>
      <p className="font-bold self-center text-md text-gray-700 mt-5 mx-7">
        Hi {name}, in this section you can see your active and closed tasks.
      </p>
      <p className="font-bold self-center text-md text-gray-700 mt-3 mx-7">
        You are able to delete them and change the status of them as you please.
      </p>
    </div>
  );
}

// ViewTasks is the main component who show the input area
// with buttons that depending what they select we are calling
// a different component
function ViewTasks({ name }) {
  // Hooks
  const [showActive, setShowActive] = useState(false);
  const [showClose, setShowClose] = useState(false);

  // returns jsx code
  return (
    <div>
      <ViewTaskMessage name={name} />
      <div>
        <button
          className="bg-blue-700 text-white rounded-md mx-7 my-5 px-3 py-2"
          onClick={() => {
            setShowActive(true);
            setShowClose(false);
          }}
        >
          View Active Tasks
        </button>
        <button
          className="bg-blue-700 text-white rounded-md my-5 px-3 py-2"
          onClick={() => {
            setShowActive(false);
            setShowClose(true);
          }}
        >
          View Closed Tasks
        </button>

        <div>
          {showActive && <ViewActiveTasks name={name} />}
          {showClose && <ViewClosedTasks name={name} />}
        </div>
      </div>
    </div>
  );
}
export default ViewTasks;
