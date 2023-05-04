// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

// Event schema model will be used
// to store information of the events

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    creator: mongoose.Types.ObjectId,
    recipient: [mongoose.Types.ObjectId],
  },
  {
    collection: "Event",
  }
);

mongoose.model("Event", eventSchema);
