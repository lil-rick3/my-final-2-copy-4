// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

// User schema model will be used
// to store information about the User section
// that will include data from other Schemas as well

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    firstName: String,
    lastName: String,
    phoneNumber: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    friends: [], // List of Ids of friends
    friendsRequests: [],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // List of Ids of reminders
    tasksCompleted: Number,
    weeklyTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "WeeklyTask" }], // List of Ids of weekly Tasks
    weeklyTasksCompleted: Number,
    organizations: [], // Organizations the user is part of
    leaderOfOrganizations: [], // Organization the user is leader of
    pendingOrgs: [], // Pending invites to orgs
    events: [], // Ids of events objects
  },
  {
    collection: "User",
  }
);

mongoose.model("User", userSchema);
