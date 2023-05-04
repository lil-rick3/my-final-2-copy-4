// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

// PendingFriends component will show your current pending friends
// with a table that has pagination
function PendingFriends({ name }) {
  // Hooks needed
  const [pendingFriends, setPendingFriends] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const PER_PAGE = 3; // number of items to display per page
  const [error, setError] = useState("");

  const handleChangeStatus = (username, status) => {
    console.log("Handle being called!");
    console.log(username, status);
    // POST request
    fetch(`/change-friend-status/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        status,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const index = pendingFriends.findIndex(
          (possibleFriend) => possibleFriend.username === username
        );

        const updatePendingFriends = [...pendingFriends];
        updatePendingFriends.splice(index, 1);
        setPendingFriends(updatePendingFriends);
      })
      .catch((err) => {
        //
      });
  };

  // GET request
  useEffect(() => {
    fetch(`/get-pending-friends/${name}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.friendsRequests.length === 0) {
          setError(`Hi ${name}! You have zero friends Requests`);
        } else {
          console.log(data);
          setPendingFriends(data.friendsRequests);
          setPageCount(Math.ceil(data.friendsRequests.length / PER_PAGE));
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching pending friends");
      });
  }, []);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  // Calculates the offset
  const offset = currentPage * PER_PAGE;

  // Autogenerates the content of the table
  const currentPendingFriends = pendingFriends
    .slice(offset, offset + PER_PAGE)
    .map((pendingFriend) => (
      <tr
        key={pendingFriend.id}
        className="bg-blue-500 border-b border-blue-700 text-white font-semibold"
      >
        <td className="px-6 py-4 w-1/6">
          <button
            onClick={() => handleChangeStatus(pendingFriend.username, "accept")}
          >
            Accept
          </button>
          <span>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;</span>
          <button
            onClick={() =>
              handleChangeStatus(pendingFriend.username, "decline")
            }
          >
            Decline
          </button>
        </td>
        <td className="px-6 py-4">{pendingFriend.username}</td>
        <td className="px-6 py-4">{pendingFriend.firstName}</td>
        <td className="px-6 py-4">{pendingFriend.lastName}</td>
      </tr>
    ));

  // If error, it return this jsx code
  if (error === "Error fetching pending friends") {
    return (
      <div>
        <p className="font-bold text-md text-gray-600 mt-6 mx-8">{error}</p>
      </div>
    );
  }

  // if list.length is empty it return this jsx code
  if (pendingFriends.length !== 0) {
    return (
      <div>
        <div className="relative overflow-x-auto mx-10 mt-10 rounded-md">
          <table className="w-full text-md text-left text-white">
            <thead className="text-xs text-white uppercase bg-blue-700">
              <tr>
                <th className="w-1/6 px-6 py-3">Status</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">First Name</th>
                <th className="px-6 py-3">Last Name</th>
              </tr>
            </thead>
            <tbody>{currentPendingFriends}</tbody>
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
  } else {
    // return this JSX code
    return (
      <div>
        <p className="font-bold text-md text-gray-600 mt-6 mx-8">
          You don't have any friend requests at the moment
        </p>
      </div>
    );
  }
}

export default PendingFriends;
