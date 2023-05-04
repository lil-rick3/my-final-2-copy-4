// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React from "react";

// Page not found is a component when the user types a wrong url
// it allows the user to send them to the login or the homepage
function PageNotFound() {
  const handleClick = () => {
    if (localStorage.getItem("loggedIn")) {
      window.location.href = "./home";
    } else {
      window.location.href = "./login";
    }
  };

  // return JSX code
  return (
    <div className="flex h-screen">
      <div className="m-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Page not found
        </h1>
        <p className="mb-3 text-xl text-gray-600">The page does not exist</p>
        <button onClick={handleClick}>
          Click here to go to home if you are already signed in!
        </button>
        <p className="mt-4">
          If you are not signed in, we will redirect you to the login page
        </p>
      </div>
    </div>
  );
}

export default PageNotFound;
