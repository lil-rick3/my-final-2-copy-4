// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

// weeklyTask schema model will be used
// to store information about the WeeklyTask section

const mongoose = require("mongoose");

const weeklyTaskSchema = new mongoose.Schema(
  {
    name: String,
    completed: Boolean,
    user: String,
  },
  {
    collection: "WeeklyTask",
  }
);

mongoose.model("WeeklyTask", weeklyTaskSchema);
