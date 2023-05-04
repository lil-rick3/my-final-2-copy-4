// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

// ViewClosedTasks will show a table of all the closed tasks
// while still providing interactivity by allowing to delete
// and open tasks
function ViewClosedTasks({ name }) {
  const [tasks, setTasks] = useState([]);
  const [serverMessage, setServerMessage] = useState("");
  const [status, setStatus] = useState("completed");
  const [loading, setLoading] = useState(true);

  // Pagination hooks
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const PER_PAGE = 6; // number of items to display per page

  const handleChangeStatus = (taskID, status) => {
    // POST request
    fetch(`/change-task-status/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskID,
        status,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const index = tasks.findIndex(
          (possibleTask) => possibleTask._id === taskID
        );

        const updateTasks = [...tasks];
        updateTasks.splice(index, 1);
        setTasks(updateTasks);
      })
      .catch((err) => {
        //
      });
  };

  useEffect(() => {
    // GET request
    fetch(`/get-tasks/${name}/${status}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          serverMessage(`Hi ${name}! You have zero closed tasks`);
          setTasks(data.tasks);
          setLoading(false);
        } else {
          setTasks(data.tasks);
          setPageCount(Math.ceil(data.tasks.length / PER_PAGE));
          setLoading(false);
        }
      })
      .catch((err) => {
        setServerMessage("Error fetching closed tasks");
      });
  }, []);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  // Calculates the offset
  const offset = currentPage * PER_PAGE;

  // Autogenerated content for table
  const currentTasks = tasks.slice(offset, offset + PER_PAGE).map((task) => (
    <tr
      key={task.id}
      className="bg-blue-500 border-b border-blue-700 text-white font-semibold"
    >
      <td className="px-6 py-4 w-1/6">
        <button onClick={() => handleChangeStatus(task._id, "open")}>
          Open
        </button>
        <span>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;</span>
        <button onClick={() => handleChangeStatus(task._id, "delete")}>
          Delete
        </button>
      </td>
      <td className="px-6 py-4">{task.title}</td>
      <td className="px-6 py-4 max-w-xs truncate">{task.description}</td>
      <td className="px-6 py-4">{task.senderName}</td>
      <td className="px-6 py-4">{task.recipientName}</td>
      <td className="px-6 py-4">Completed</td>
    </tr>
  ));

  // If loading it returns this jsx code
  if (loading) {
    return (
      <div className="font-bold self-center text-md text-gray-700 mt-2 mx-7">
        Loading data...
      </div>
    );
  }

  // jsx code being returned
  if (!loading && tasks.length === 0) {
    return (
      <div className="font-bold self-center text-md text-gray-700 mt-2 mx-7">
        You don't have any closed tasks currently...
      </div>
    );
  }

  // jsx code being returned
  if (tasks.length >= 1) {
    return (
      <div>
        <div className="relative overflow-x-auto mx-10 mt-10 rounded-md">
          <table className="w-full text-md text-left text-white">
            <thead className="text-xs text-white uppercase bg-blue-700">
              <tr>
                <th className="w-1/6 px-6 py-3">Action</th>
                <th className="w-1/6 px-6 py-3">Title</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Sender</th>
                <th className="px-6 py-3">Recipient</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>{currentTasks}</tbody>
          </table>
        </div>
        <div className="flex flex-row justify-center my-10">
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"flex space-x-4"}
            previousLinkClassName={
              "bg-blue-500 px-3 py-2 rounded-md text-md font-bold text-white"
            }
            nextLinkClassName={
              "bg-blue-500 px-3 py-2 rounded-md text-md font-bold text-white"
            }
            disabledClassName={"disabled"}
            activeClassName={
              "bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium"
            }
          />
        </div>
      </div>
    );
  }
}

export default ViewClosedTasks;
