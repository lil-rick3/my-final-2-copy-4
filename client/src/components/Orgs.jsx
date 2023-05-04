// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

// Imports needed
import React, { useState, useEffect } from "react";
import CreateOrgInput from "./CreateOrgInput";
import InviteOrgInput from "./InviteOrgInput";
import LeaveOrgInput from "./LeaveOrgInput";
import ViewOrgRequests from "./ViewOrgRequests";
import ViewOrgs from "./ViewOrgs";

// Orgs component is the main component for organization
// it will allow user to add organization, view organizaiton
// accept invitations, and leave organizations
function Orgs({ name }) {
  // hooks needed
  const [createOrg, setCreateOrg] = useState(false);
  const [inviteOrg, setInviteOrg] = useState(false);
  const [viewRequests, setViewRequests] = useState(false);
  const [viewOrganizations, setViewOrganizations] = useState(false);
  const [leaveOrganization, setLeaveOrganization] = useState(false);

  // Return JSX code with components imported
  return (
    <div>
      <div>
        <h1
          className="font-semibold self-center text-3xl 
        text-gray-700 mt-7 mx-7"
        >
          Organizations
        </h1>
        <p
          className="font-semibold self-center text-lg
         text-gray-700 mt-3 mx-7"
        >
          Welcome {name}, here you can create and manage organizations, where
          you can invite your friends to them.
        </p>
        <div className="flex flex-row mx-3 py-2">
          <button
            className="bg-blue-700 text-white rounded-md 
            ml-4 px-3 py-2"
            onClick={() => {
              setCreateOrg(true);
              setInviteOrg(false);
              setViewRequests(false);
              setViewOrganizations(false);
              setLeaveOrganization(false);
            }}
          >
            Create Organization
          </button>
          <button
            className="bg-blue-700 text-white rounded-md 
            ml-4 px-3 py-2"
            onClick={() => {
              setCreateOrg(false);
              setInviteOrg(true);
              setViewRequests(false);
              setViewOrganizations(false);
              setLeaveOrganization(false);
            }}
          >
            Invite Friends
          </button>
          <button
            className="bg-blue-700 text-white rounded-md 
            ml-4 px-3 py-2"
            onClick={() => {
              setCreateOrg(false);
              setInviteOrg(false);
              setViewRequests(true);
              setViewOrganizations(false);
              setLeaveOrganization(false);
            }}
          >
            View Requests
          </button>
          <button
            className="bg-blue-700 text-white rounded-md 
            ml-4 px-3 py-2"
            onClick={() => {
              setCreateOrg(false);
              setInviteOrg(false);
              setViewRequests(false);
              setViewOrganizations(true);
              setLeaveOrganization(false);
            }}
          >
            View Organizations
          </button>
          <button
            className="bg-blue-700 text-white rounded-md 
            ml-4 px-3 py-2"
            onClick={() => {
              setCreateOrg(false);
              setInviteOrg(false);
              setViewRequests(false);
              setViewOrganizations(false);
              setLeaveOrganization(true);
            }}
          >
            Leave Organization
          </button>
        </div>
      </div>
      {/* Components displayed based on selection */}
      {createOrg && <CreateOrgInput name={name} />}
      {inviteOrg && <InviteOrgInput name={name} />}
      {viewRequests && <ViewOrgRequests name={name} />}
      {viewOrganizations && <ViewOrgs name={name} />}
      {leaveOrganization && <LeaveOrgInput name={name} />}
    </div>
  );
}

export default Orgs;
