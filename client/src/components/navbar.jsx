// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { useState, useEffect } from "react";

// Navbar is a component that will be a navbar that will allow users
// to navigate between components in the home page

const Navbar = ({ onLinkClick }) => {
  // returning jsx code
  return (
    <div className="flex h-screen bg-gray-200">
      <div className="w-64 bg-blue-600">
        <div className="flex items-center justify-center mt-7 h-30 text-white">
          <img src="/clock.png" alt="Clock" className="w-24" />
        </div>
        <nav className="mt-5">
          <button
            className="block py-3 px-4 text-sm font-bold text-white
             hover:bg-blue-500 hover:text-white"
            onClick={() => onLinkClick("Home")}
          >
            Home
          </button>
          <button
            className="block py-3 px-4 text-sm font-bold text-white
             hover:bg-blue-500 hover:text-white"
            onClick={() => onLinkClick("Create Task")}
          >
            Create Task
          </button>
          <button
            className="block py-3 px-4 text-sm font-bold text-white
             hover:bg-blue-500 hover:text-white"
            onClick={() => onLinkClick("View Tasks")}
          >
            View Tasks
          </button>
          <button
            className="block py-3 px-4 text-sm font-bold text-white
             hover:bg-blue-500 hover:text-white"
            onClick={() => onLinkClick("Weekly Progress")}
          >
            Weekly Progress
          </button>
          <button
            className="block py-3 px-4 text-sm font-bold text-white
             hover:bg-blue-500 hover:text-white"
            onClick={() => onLinkClick("Friends")}
          >
            Friends
          </button>
          <button
            className="block py-3 px-4 text-sm font-bold text-white
             hover:bg-blue-500 hover:text-white"
            onClick={() => onLinkClick("Organizations")}
          >
            Organizations
          </button>
          <button
            className="block py-3 px-4 text-sm font-bold text-white
             hover:bg-blue-500 hover:text-white"
            onClick={() => onLinkClick("Events")}
          >
            Events
          </button>
          <button
            className="block py-3 px-4 text-sm font-bold text-white
             hover:bg-blue-500 hover:text-white"
            onClick={() => onLinkClick("Help")}
          >
            Help
          </button>
          <button
            className="block py-3 px-4 text-sm font-bold text-white
             hover:bg-blue-500 hover:text-white"
            onClick={() => onLinkClick("Log Out")}
          >
            Log Out
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
