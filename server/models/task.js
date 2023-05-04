// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

// Task schema model will be used
// to store information the tasks of a user

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    sender: String,
    senderName: String,
    recipient: String,
    recipientName: String,
    completed: Boolean,
    // reminder_interval: Number,
    // last_reimind: Number,
  },
  {
    collection: "Task",
  }
);

mongoose.model("Task", taskSchema);
