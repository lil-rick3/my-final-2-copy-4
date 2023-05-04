// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

// Imports needed
import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";

// Pagination is a component that will allow us to limit the to do list
// to 7 items per page so that it does not affect the view of the UI
function Pagination({ tasksPerPage, totalTasks, handlePageChange }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTasks / tasksPerPage); i++) {
    pageNumbers.push(i);
  }
  if (totalTasks <= 7) {
    return;
  }

  // JSX Component
  return (
    <div className="flex flex-row">
      <p className="font-bold self-center text-md text-gray-700 mt-5 ml-10">
        Pages:
      </p>
      <ul className="flex mt-4 ml-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => handlePageChange(number)}
              className="px-3 py-2 mx-2 border rounded-md hover:bg-gray-300"
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Weekly Progress is a component that will let users add items to a to do list that
// is based on a week timespan and it shows a bar that shows in a percentage way the progress
// made, after every week it will remove all the items automatically for the user
function WeeklyProgress({ name }) {
  // Hooks
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(7);
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    fetch(`/get-weekly-progress/${name}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTasks(data.weeklyTasks);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  // POST method to send the data to the server once the saveData button
  // is clicked
  const saveData = async (username) => {
    try {
      console.log("Username " + username);
      const res = await fetch(`/post-weekly-progress/${username}`, {
        method: "POST",
        body: JSON.stringify({
          tasks,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data.message);
      setServerMessage(data.message);
      console.log("Server message:" + serverMessage);
      // clears up server message after 5 seconds
      setTimeout(() => {
        setServerMessage("");
      }, 5000);
    } catch (err) {
      console.log("Error at post");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleNewTaskSubmit = (event) => {
    event.preventDefault();
    if (newTask) {
      setTasks([...tasks, { name: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const handleTaskDelete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleTaskCompletionToggle = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const completedTaskStyle = {
    textDecoration: "line-through",
    color: "gray",
  };

  const completedTasksCount = tasks.filter((task) => task.completed).length;

  const totalTasksCount = tasks.length;
  const progressPercent =
    totalTasksCount === 0
      ? 0
      : Math.floor((completedTasksCount / totalTasksCount) * 100);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  // JSX component
  return (
    <div>
      <div>
        <h1 className="font-semibold self-center text-3xl text-gray-700 mt-7 mx-7">
          Weekly Progress
        </h1>
        <p className="font-bold self-center text-md text-gray-700 mt-5 mx-7">
          Here is where you can add tasks that you have to accomplish and mark
          them as complete or delete them
        </p>
        <p className="font-bold self-center text-md text-gray-700 mt-2 mx-7">
          The progress bar shows how you're doing this week
        </p>
      </div>
      <div className="w-full">
        <ProgressBar progressPercent={progressPercent} />
      </div>

      <form onSubmit={handleNewTaskSubmit} className="mt-4 mx-7">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={handleNewTaskChange}
          className="w-1/3 border border-gray-300 rounded-md px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-700 text-white rounded-md ml-4 px-3 py-2"
        >
          Add Task
        </button>
        <button
          type="submit"
          className="bg-blue-700 text-white rounded-md ml-4 px-3 py-2"
          onClick={() => saveData(name)}
        >
          Save Data
        </button>
      </form>
      {serverMessage === "Weekly tasks updated successfully" && (
        <div className="font-bold text-md text-gray-600 mt-6 mx-8">
          {serverMessage}
        </div>
      )}
      <Pagination
        tasksPerPage={tasksPerPage}
        totalTasks={tasks.length}
        handlePageChange={handlePageChange}
      />
      <ul className="flex flex-col font-bold mx-10 my-5 justify-self-center">
        {currentTasks.map((task, index) => (
          <li
            key={index}
            style={task.completed ? completedTaskStyle : {}}
            className="mt-3"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleTaskCompletionToggle(index)}
              className="mr-2 w-5 h-5 rounded-md"
            />
            {task.name}
            {!task.completed && (
              <button
                onClick={() => handleTaskDelete(index)}
                className="ml-4 w-7 h-7 border border-gray-500 rounded-md 
                font-bold text-gray-500 hover:text-red-600 hover:border-red-600 "
              >
                X
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeeklyProgress;
