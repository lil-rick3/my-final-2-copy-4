// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre
import React from "react";

// ProgressBar component will show a progress bar
// which has a certain percentage of the bar green
// depending of the input
function ProgressBar({ progressPercent }) {
  // return jsx code
  return (
    <div className="flex items-center mt-4 w-full mx-7">
      <div className="w-1/3 bg-gray-300 rounded-md overflow-hidden h-5">
        <div
          className="bg-green-600 h-5"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <span className="ml-2 font-bold">{progressPercent}%</span>
    </div>
  );
}

export default ProgressBar;
