// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

// Org schema model will be used
// to store information the organization

const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    leader: String,
    leaderName: String,
    people: [], // List of Ids of friends
    pendingInvites: [],
    events: [],
  },
  {
    collection: "Org",
  }
);

mongoose.model("Org", orgSchema);
