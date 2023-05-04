// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { useState, useEffect } from "react";

// Help component, will have information needed for the user
// to understand how to use the website
function Help({ name }) {
  return (
    <div className="max-h-full overflow-y-auto">
      <h1 className="font-semibold self-center text-3xl text-gray-700 mt-7 mx-7">
        Help section
      </h1>
      <div>
        <h2 className="font-bold self-center text-xl text-gray-700 mt-7 mx-7">
          Create Task
        </h2>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          In Create Task, you are able to create a task and it will get store to
          your account.
        </p>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          If you are a leader of an organization, you are able to create the
          task for a member of your organization.
        </p>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          Whoever the task is sent to, will receive a text message about the
          task.
        </p>
      </div>
      <div className="my-7">
        <h2 className="font-bold self-center text-xl text-gray-700 mt-5 mx-7">
          View Tasks
        </h2>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          In View Tasks, you are able to see the active tasks, and closed tasks.
        </p>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          You are also able to open tasks, close them, and delete them.
        </p>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          Which will be reflected on their perspective tables.
        </p>
      </div>
      <div className="my-7">
        <h2 className="font-bold self-center text-xl text-gray-700 mt-5 mx-7">
          Weekly Progress
        </h2>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          In Weekly Progress, you are able to add small tasks, that will be
          deleted automatically,
        </p>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          that will be deleted automatically, every Sunday.
        </p>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          There is a progress bar that will help to visualize how many tasks,
          have been marked as done.
        </p>
      </div>
      <div className="my-7">
        <h2 className="font-bold self-center text-xl text-gray-700 mt-5 mx-7">
          Friends
        </h2>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          In Friends, you are able to add people, see your friends, and accept
          friends' requests.
        </p>
      </div>
      <div className="my-7">
        <h2 className="font-bold self-center text-xl text-gray-700 mt-5 mx-7">
          Organizations
        </h2>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          In Organization, you are able to create your own organization, as well
          as invite people
        </p>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          to them, view your invites, view your organizations, and leave an
          organization.
        </p>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          If you are the leader of one, leaving it will delete the entire
          organization.
        </p>
      </div>
      <div className="my-7">
        <h2 className="font-bold self-center text-xl text-gray-700 mt-5 mx-7">
          Events
        </h2>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          In Events, you are able to create an event and this is only available
          if
        </p>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          you are the leader of an organization.
        </p>
        <p className="font-semibold self-center text-md text-gray-700 mt-2 mx-7">
          It will send a text message to all the members of the organization
          about the event.
        </p>
        {/* It was needed for license reasons for the logo*/}
        <a
          className="text-xs text-white pointer-events-none"
          href="https://pngtree.com/so/clock"
        >
          clock png from pngtree.com/
        </a>
      </div>
    </div>
  );
}

export default Help;
