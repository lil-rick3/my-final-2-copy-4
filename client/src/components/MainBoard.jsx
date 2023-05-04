// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React from "react";

// MainBoard component will show a nice message center
// and invite the user to use the navbar to go to their section
// of choice
function MainBoard({ name }) {
  return (
    <div>
      <div>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="font-bold text-4xl text-gray-600 ">
            Welcome to Deadline {name}!
          </h1>
          <p className="font-bold text-md text-gray-600 mt-6 mx-8">
            Use the navbar to go to your desired section
          </p>
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  );
}

export default MainBoard;
