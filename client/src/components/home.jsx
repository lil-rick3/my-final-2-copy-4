// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

// Imports Needed
import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Friends from "./Friends";
import CreateTask from "./CreateTask";
import ViewTasks from "./ViewTasks";
import WeeklyProgress from "./WeeklyProgress";
import Orgs from "./Orgs";
import Events from "./Events";
import Help from "./Help";
import MainBoard from "./MainBoard";

// Home component is the main component where we will render
// the component based on the navbar so the user can keep
// going to other section without needed to change the site
const Home = () => {
  // Hooks needed
  const [homeData, setHomeData] = useState("");
  const [selectedPage, setSelectedPage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // POST request
        const response = await fetch("http://localhost:80/homeData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: window.localStorage.getItem("token"),
          }),
        });
        const data = await response.json();
        // console.log("Data ->");
        // console.log(data);
        if (data.data === "token expired") {
          setHomeData("token expired");
        } else {
          setHomeData(data.data);
        }
        // console.log(data, "homeData");
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // console.log("homeData ->");
    // console.log(homeData);
  }, []);

  // logOut logs the User out
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };

  // Handle the link based on navbars
  const handleLinkClick = (page) => {
    if (page === "Log Out") {
      logOut();
    } else {
      setSelectedPage(page);
    }
  };

  // Here is some logic for showing the no data or an actual section
  if (homeData === "token expired") {
    setTimeout(() => {
      logOut();
    }, 1000);
    return (
      <div>
        <h1>No data</h1>
      </div>
    );
  } else {
    // We are showing the respective component based on what the user
    // has selected
    return (
      <div className="flex flex-row h-screen">
        <div className="w-1/6 flex-grow">
          <Navbar onLinkClick={handleLinkClick} />
        </div>
        <div className="w-5/6 flex-grow">
          {selectedPage === "Create Task" && (
            <CreateTask name={homeData.username} />
          )}
          {selectedPage === "View Tasks" && (
            <ViewTasks name={homeData.username} />
          )}
          {selectedPage === "" && <MainBoard name={homeData.username} />}
          {selectedPage === "Weekly Progress" && (
            <WeeklyProgress name={homeData.username} />
          )}
          {selectedPage === "Friends" && <Friends name={homeData.username} />}
          {selectedPage === "Organizations" && (
            <Orgs name={homeData.username} />
          )}
          {selectedPage === "Events" && <Events name={homeData.username} />}
          {selectedPage === "Help" && <Help name={homeData.username} />}
          {selectedPage === "Home" && <MainBoard name={homeData.username} />}
          {/* {console.log("homeData ->", homeData)} */}
        </div>
      </div>
    );
  }
};

export default Home;
