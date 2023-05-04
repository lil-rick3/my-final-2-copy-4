// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

// Imports needed
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/login";
import Signup from "./components/signup";
import Home from "./components/home";
import PageNotFound from "./components/pageNotFound";

// App is the main component which handle the routing for other components
function App() {
  // Getting token
  const loggedIn = window.localStorage.getItem("loggedIn");

  // Returns jsx code
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={loggedIn ? <Home /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
