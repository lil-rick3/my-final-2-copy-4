// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

// Server.js is the main logic for the server of our react front-end where
// we have GET and POST routes define for interactivity between our MongoDB and React
// We have a different folder where we are defining our schemas

// Here are the dependecies needed for this project
// When downloading this project make sure to cd into the server folder
// and npm i, to install all the modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const jwtSecret = "fn34fb5y4bgu54gb45ybg4y5ryth43ugbru34ytgv3yu5vt";

app.use(express.json());
app.use(cors());

// Berny Twilio Account
// Please TAs don't spam the messages feature, it is not free
const twilioAccountSID = "AC893ba15aef660561a773be3397561a8c";
const twilioAuthToken = "d295ba64afe395da084faf02477531d3";
const twilioPhoneNbr = "+18442539481";
const client = require("twilio")(twilioAccountSID, twilioAuthToken);

// sendMessage method receives an parameters a phone number,
// and a message, that with the twilio api, will sent
// a text message to the phone number given
const sendMessage = (phone, message) => {
  console.log(phone, message);
  client.messages
    .create({
      from: twilioPhoneNbr,
      to: phone,
      body: message,
    })
    .then((message) => console.log(message.sid));
};

// sendMessage("+13615226002", "Testing");
// Port in use
const port = 80;

// We are defining our schemas in the folder models,
// to make the code in server.js smaller
require("./models/user");
require("./models/event");
require("./models/task");
require("./models/weeklyTask");
require("./models/org");

// connectionString for our mongo db
const connectionString =
  "mongodb+srv://jbm3:1234@cluster0.kdcfo15.mongodb.net/?retryWrites=true&w=majority";

// Connecting to the db
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// Mongoose models of our schemas
const User = mongoose.model("User");
const Event = mongoose.model("Event");
const Task = mongoose.model("Task");
const WeeklyTask = mongoose.model("WeeklyTask");
const Org = mongoose.model("Org");

// createAccount POST route will receive the data from the create Account
// form and will create an User if the email and the username and
// the phone number have not been used
// It will also encrypt the password, to finally store it in the db
app.post("/createAccount", async (req, res) => {
  const { username, firstName, lastName, phoneNumber, email, password } =
    req.body;
  try {
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    const existingPhoneNumber = await User.findOne({ phoneNumber });

    if (existingEmail) {
      return res.send({
        error: "This email has already been registered with an account",
      });
    }
    if (existingUsername) {
      return res.send({ error: "Username already exists" });
    }
    if (existingPhoneNumber) {
      return res.send({
        error: "This phone number has already been registered with an account",
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username: username,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: "+1" + phoneNumber,
      email: email,
      password: encryptedPassword,
      friends: [],
      friendsRequests: [],
      tasks: [],
      tasksCompleted: 0,
      weeklyTasks: [],
      weeklyTasksCompleted: 0,
      organizations: [],
      leaderOfOrganizations: [],
      pendingOrgs: [],
    });

    res.send({ status: "ok" });
    console.log("User saved");
  } catch (err) {
    res.send({ status: "error" });
    console.log("Error at saving user");
  }
});

// loginAccount POST route will check if the user actually exists
// and will compare if the encrypted password matches with the password
// give in the login, if it does it will send a token to the front-end
app.post("/loginAccount", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.json({ error: "Login details are incorrect" });
  }

  if (
    !existingUser &&
    !(await bcrypt.compare(password, existingUser.password))
  ) {
    return res.json({ error: "Login details are incorrect" });
  }

  const token = jwt.sign({ email: existingUser.email }, jwtSecret, {
    expiresIn: "2h",
  });

  if (res.status(201)) {
    return res.json({ status: "ok", data: token });
  } else {
    return res.json({ error: "error" });
  }
});

// homeData post route will recive the token and it will verify the account
// if it is verified and the token is not expired,
// it will send the user data to the front-end
app.post("/homeData", async (req, res) => {
  const { token } = req.body;
  console.log(token);
  try {
    const user = jwt.verify(token, jwtSecret, (err, res) => {
      if (err) {
        return "token expired";
      } else {
        return res;
      }
    });

    if (user === "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    User.findOne({ email: user.email })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((err) => res.send({ status: "error", data: error }));
  } catch (err) {
    res.json({ error: "Error at /username/TODO" });
    console.log("Error at /username/TODO");
  }
});

// Task Section //
// includes add-task POST route, get-tasks GET route
// change-task-status POST route

// add-task POST route will allow users to add tasks to themselves
// which they will receive a text message with what the text is about
// if they are the leader of an organization they will be able to
// set tasks for the people in that particular organization
app.post("/add-task/:username", async (req, res) => {
  console.log(req.body);
  const { title, description, recipient } = req.body;
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.json({ message: "User not found" });
    }
    let recipientUser;
    if (recipient === "" || recipient === null) {
      recipientUser = user;
    } else {
      recipientUser = await User.findById(recipient);
    }
    if (!recipientUser) {
      return res.json({ message: "Recipient not found" });
    }

    const newTask = new Task({
      title,
      description,
      sender: user._id,
      senderName: user.username,
      recipient: recipientUser._id,
      recipientName: recipientUser.username,
      completed: false,
    });

    await newTask.save();
    user.tasks.push(newTask._id);
    await user.save();

    sendMessage(recipientUser.phoneNumber, title + " - " + description);

    return res.json({ message: "Task has been sent!" });
  } catch (err) {
    return res.json({ error: "Error at /add-task/username" });
  }
});

// get-tasks GET route will get all the active and completed tasks
// to the user so that they can be displayed in the front-end
app.get("/get-tasks/:name/:status", async (req, res) => {
  try {
    console.log(req.params.name);
    const user = await User.findOne({ username: req.params.name }).populate({
      path: "tasks",
    });

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const tasksIDs = user.tasks.map((task) => task._id);
    if (req.params.status === "active") {
      const tasks = await Task.find({
        _id: { $in: tasksIDs },
        completed: false,
      });
      return res.json({ tasks });
    }
    if (req.params.status === "completed") {
      const tasks = await Task.find({
        _id: { $in: tasksIDs },
        completed: true,
      });
      return res.json({ tasks });
    }
  } catch (err) {
    return res.json({ error: "Error at /get-friends/name" });
  }
});

// change-task-status POST route will allow the user to
// change their task
// status from active to close, and delete them if needed
app.post("/change-task-status/:name", async (req, res) => {
  const { taskID, status } = req.body;

  try {
    const user = await User.findOne({ username: req.params.name }).populate({
      path: "tasks",
    });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const possibleTask = await Task.findOne({ _id: taskID });
    if (!possibleTask) {
      return res.json({ message: "Task not found" });
    }

    if (status === "close") {
      possibleTask.completed = true;
      user.tasksCompleted += 1;
      await user.save();
      await possibleTask.save();
      return res.json({ message: "Task has been closed" });
    }
    if (status === "delete") {
      if (possibleTask.completed) {
        user.tasksCompleted -= 1;
      }
      user.tasks.pull(possibleTask._id);
      await user.save();
      await Task.deleteOne({ _id: possibleTask._id });
      return res.json({ message: "Task has been deleted" });
    }
    if (status === "open") {
      user.tasksCompleted -= 1;
      possibleTask.completed = false;
      await user.save();
      await possibleTask.save();
      return res.json({ message: "Task has been opened" });
    }
    return res.json({ message: "Error" });
  } catch (err) {
    return res.json({ message: "Error at back-end" });
  }
});

// sent-friend-request POST route will send a friend request
// to a user if it exists
app.post("/sent-friend-request", async (req, res) => {
  console.log(req.body);
  const { name, friend } = req.body;
  try {
    if (name === friend) {
      return res.json({ message: "You cannot add yourself as your friend" });
    }

    const friendUser = await User.findOne({ username: friend });
    if (!friendUser) {
      return res.json({ message: "Friend does not exist" });
    }
    const user = await User.findOne({ username: name });
    if (!user) {
      return res.json({ message: "User is no longer authorize" });
    }
    if (
      user.friends.includes(friendUser._id) ||
      friendUser.friends.includes(user._id)
    ) {
      return res.json({ message: "Users are already friends" });
    }

    // user.friendsRequests.push(friendUser._id);
    friendUser.friendsRequests.push(user._id);

    await user.save();
    await friendUser.save();
    return res.json({ message: "Friend requests sent!" });
  } catch (err) {
    return res.json({ message: "Error at /add-friend" });
  }
});

// get-pending-friends GET route will retrieve all the pending
// friends requests if the user have any
app.get("/get-pending-friends/:name", async (req, res) => {
  try {
    if (!req.params.name) {
      return res.json({ message: "User cookie has expired!" });
    }
    const user = await User.findOne({ username: req.params.name }).populate({
      path: "friendsRequests",
    });
    if (!user) {
      return res.json({ message: "User has no friend requests" });
    }
    const friendsRequests = await User.find({
      _id: { $in: user.friendsRequests },
    });
    return res.json({ friendsRequests });
  } catch (err) {
    return res.json({ message: "Error at fetching pending friends" });
  }
});

// change-friend-status POST route will change the pending friend
// request from pending to either accepted or declined
app.post("/change-friend-status/:name", async (req, res) => {
  // const name = req.params;
  const { username, status } = req.body;
  try {
    const user = await User.findOne({ username: req.params.name }).populate({
      path: "friendsRequests",
    });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const possibleFriend = await User.findOne({ username: username });
    if (!possibleFriend) {
      return res.json({ message: "Friend not found" });
    }

    if (status === "decline") {
      // Removes the friend request from user
      user.friendsRequests = user.friendsRequests.filter(
        (request) => request.toString() !== possibleFriend._id.toString()
      );
      await user.save();
      return res.json({ message: "Friend request declined" });
    }

    if (status === "accept") {
      user.friends.push(possibleFriend._id);
      possibleFriend.friends.push(user._id);
      // Removes the friend request from user
      user.friendsRequests = user.friendsRequests.filter(
        (request) => request.toString() !== possibleFriend._id.toString()
      );
      await Promise.all([user.save(), possibleFriend.save()]);
      return res.json({ message: "Friend request accepted" });
    }
  } catch (err) {
    return res.json({ message: "Error at route" });
  }
});

// get-friend GET route will get all the friends of a particular
// user if the user has friends
app.get("/get-friends/:name", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.name }).populate({
      path: "friends",
    });

    if (!user) {
      return res.json({ message: "User not found" });
    }
    let friends = [];

    for (const friend of user.friends) {
      const friendUser = await User.findById(friend);
      friends.push({
        username: friendUser.username,
        name: friendUser.firstName + " " + friendUser.lastName,
        tasks: friendUser.tasks.length,
        tasksAccomplished: friendUser.tasksCompleted,
        weeklyTasks: friendUser.weeklyTasks.length,
        weeklyTasksAccomplished: friendUser.weeklyTasksCompleted,
      });
    }
    console.log(friends);
    res.json({ friends });
  } catch (err) {
    return res.json({ error: "Error at /get-friends/name" });
  }
});

// Weekly Progress Section //
// Includes /post-weeky-progress POST route,
// /get-weekly-progress GET route,

// POST route
app.post("/post-weekly-progress/:username", async (req, res) => {
  try {
    const { tasks } = req.body;
    const { username } = req.params;

    // Find user and populate weeklyTasks array
    const user = await User.findOne({ username: username }).populate(
      "weeklyTasks"
    );
    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    if (tasks === null || tasks.length === 0) {
      user.weeklyTasks = [];
      user.weeklyTasksCompleted = 0;
      await WeeklyTask.deleteMany({ user: user._id });
      await user.save();
      return res.json({ message: "Weekly tasks updated successfully" });
    }

    await WeeklyTask.deleteMany({ user: user._id });

    // Clear existing tasks from user's weeklyTasks array
    user.weeklyTasks = [];
    user.weeklyTasksCompleted = 0;

    // Create new WeeklyTask documents for each task
    const newTasks = tasks.map(
      (task) =>
        new WeeklyTask({
          name: task.name,
          completed: task.completed,
          user: user._id,
        })
    );

    // Add new tasks to user's weeklyTasks array
    user.weeklyTasks = newTasks.map((task) => task._id);

    newTasks.forEach((task) => {
      if (task.completed) {
        user.weeklyTasksCompleted++;
      }
    });

    // // Delete existing tasks from database
    // await WeeklyTask.deleteMany({ user: user._id });

    // Save user and new WeeklyTask documents
    await Promise.all([user.save(), WeeklyTask.insertMany(newTasks)]);
    // Send response indicating successful update
    return res.json({ message: "Weekly tasks updated successfully" });
  } catch (err) {
    return res.json({ error: "Error at /get-weeky-progress" });
  }
});

// GET route to get all the weekly progress item of the user
app.get("/get-weekly-progress/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find user and populate weeklyTasks array
    const user = await User.findOne({ username: username }).populate(
      "weeklyTasks"
    );

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const weeklyTasks = await WeeklyTask.find({
      _id: { $in: user.weeklyTasks },
    });

    return res.json({ weeklyTasks });
  } catch (err) {
    return res.json({ error: "Error at /get-weeklyprogress" });
  }
});

// This will clear up the data after every week
// for weeklyTasks
cron.schedule("0 0 * * 0", async () => {
  try {
    console.log(
      "Clearing all weekly tasks and deleting data in the WeeklyTask collection"
    );
    await WeeklyTask.deleteMany({});
    await User.updateMany({}, { $set: { weeklyTasks: [] } });
    console.log("Weekly tasks cleared and data deleted successfully.");
  } catch (err) {
    console.error("Error clearing weekly tasks and deleting data: ", err);
  }
});

// Organizations Section //

// Includes /create-org POST route, /invite-org POST route,
// /get-pending-orgs GET route, /change-org-status POST route
// /get-my-orgs GER oute, /leave-org POST route

// create-org POST route will create an organization under a user name
app.post("/create-org/:name", async (req, res) => {
  const { organization } = req.body;
  const user = await User.findOne({ username: req.params.name });
  console.log(organization);

  if (!user) {
    return res.json({ message: "User does not exist" });
  }

  const org = await Org.findOne({ name: organization });

  if (org) {
    return res.json({ message: "Organization already exists!" });
  }

  const newOrg = new Org({
    name: organization,
    leader: user._id,
    leaderName: req.params.name,
    people: [user._id],
  });

  await newOrg.save();
  user.organizations.push(newOrg._id);
  user.leaderOfOrganizations.push(newOrg._id);
  await user.save();

  res.json({
    message: `${req.params.name} your organization ${organization} has been created!`,
  });
});

// invite-org POST route will invite a friend of a user to an organization
// and will check to see if the user has already been invited, or if the
// user its part of the organization already
app.post("/invite-org/:name", async (req, res) => {
  try {
    const { organization, friend } = req.body;
    console.log(organization);

    if (req.params.name === friend) {
      return res.json({
        message: "You cannot add yourself, since you are the leader",
      });
    }
    const user = await User.findOne({ username: req.params.name });
    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    const friendObj = await User.findOne({ username: friend });
    if (!friendObj) {
      return res.json({ message: "Friend does not exist" });
    }

    const org = await Org.findOne({ name: organization });
    if (!org) {
      return res.json({ message: "Organization does not exist!" });
    }

    if (org.leader !== user._id.toString()) {
      return res.json({
        message: "User is not the leader of the organization",
      });
    }

    if (!user.friends.includes(friendObj._id)) {
      return res.json({ message: "Friend is not in user's friends list!" });
    }

    if (org.pendingInvites.includes(friendObj._id)) {
      return res.json({ message: "Invite already sent" });
    }

    if (org.people.includes(friendObj._id)) {
      return res.json({ message: `${friend} is already in the Organization` });
    }

    org.pendingInvites.push(friendObj._id);
    await org.save();
    friendObj.pendingOrgs.push(org._id);
    await friendObj.save();

    return res.json({
      message: `Invite from ${organization} to ${friend} has been sent!`,
    });
  } catch (err) {
    return res.json({ message: "Error at route" });
  }
});

// get-pending-orgs GET route will return the list of organizations
// who have invited the current user
app.get("/get-pending-orgs/:name", async (req, res) => {
  try {
    if (!req.params.name) {
      return res.json({ message: "User cookie has expired!" });
    }
    const user = await User.findOne({ username: req.params.name }).populate({
      path: "pendingOrgs",
    });
    if (!user) {
      return res.json({ message: "User has no organizations invites" });
    }
    const pendingOrgs = await Org.find({
      _id: { $in: user.pendingOrgs },
    });
    return res.json({ pendingOrgs });
  } catch (err) {
    return res.json({ message: "Error at fetching organizations invites" });
  }
});

// change-org-status POST route will update a specific pending Organization
// that the user can either accept or decline to join them
app.post("/change-org-status/:name", async (req, res) => {
  const { organization, status } = req.body;
  try {
    const user = await User.findOne({ username: req.params.name }).populate({
      path: "pendingOrgs",
    });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const possibleOrg = await Org.findOne({ name: organization });
    if (!possibleOrg) {
      return res.json({ message: "Organization not found" });
    }

    if (status === "decline") {
      // Removes the friend request from user
      user.pendingOrgs = user.pendingOrgs.filter(
        (request) => request.toString() !== possibleOrg._id.toString()
      );
      possibleOrg.pendingInvites = possibleOrg.pendingInvites.filter(
        (request) => request.toString() !== user._id.toString()
      );
      await Promise.all([user.save(), possibleOrg.save()]);
      return res.json({ message: "Organization request declined" });
    }

    if (status === "accept") {
      user.organizations.push(possibleOrg._id);
      possibleOrg.people.push(user._id);
      // Removes the friend request from user
      possibleOrg.pendingInvites = possibleOrg.pendingInvites.filter(
        (request) => request.toString() !== user._id.toString()
      );
      user.pendingOrgs = user.pendingOrgs.filter(
        (request) => request.toString() !== possibleOrg._id.toString()
      );
      await Promise.all([user.save(), possibleOrg.save()]);
      return res.json({ message: "Organization request accepted" });
    }
  } catch (err) {
    return res.json({ message: "Error at route" });
  }
});

// get-my-orgs GET route will get all the organizations a user is part of
// as well as populate them with data that then will be sent to the client
app.get("/get-my-orgs/:name", async (req, res) => {
  try {
    const { name } = req.params;

    // Find user and populate weeklyTasks array
    const user = await User.findOne({ username: name }).populate(
      "organizations"
    );

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const organizations = await Org.find({
      _id: { $in: user.organizations },
    });

    return res.json({ organizations });
  } catch (err) {
    return res.json({ error: "Error at /get-my-orgs" });
  }
});

// leave-org POST route will allow users to leave the org that they belong to
// if they are the leader of the org it will delete the org for everyone
app.post("/leave-org/:name", async (req, res) => {
  const { organization } = req.body;
  const user = await User.findOne({ username: req.params.name });
  if (!user) {
    return res.json({ message: "User not found" });
  }
  const org = await Org.findOne({ name: organization });
  if (!org) {
    return res.json({ message: "Org does not exist" });
  }

  if (!org.people.includes(user._id)) {
    return res.json({
      message: `${req.params.name} is not a member of the organization ${organization}`,
    });
  }
  if (org.leader === user._id.toString()) {
    await Org.deleteOne({ _id: org._id });
    await User.updateMany(
      { _id: { $in: org.people.concat(org.pendingInvites, org.leader) } },
      {
        $pull: {
          organizations: org._id,
          leaderOfOrganizations: org._id,
          pendingOrgs: org._id,
        },
      }
    );
    return res.json({ message: `${organization} deleted and users removed` });
  }

  // if user is not the leader
  org.people = org.people.filter((person) => !person.equals(user._id));
  user.organizations = user.organizations.filter(
    (orgId) => !orgId.equals(org._id)
  );
  await Promise.all([org.save(), user.save()]);
  return res.json({
    message: `${req.params.name} removed from ${organization}`,
  });
});

// get-names-orgs GET route will return all the people who
// are part of a certain organization
app.get("/get-names-orgs/:name", async (req, res) => {
  const user = await User.findOne({ username: req.params.name });

  if (!user) {
    return res.json({ message: "User not found" });
  }

  const orgUserIds = await User.find({
    organizations: { $in: user.leaderOfOrganizations },
  }).select("_id username");

  const orgUsers = orgUserIds.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  return res.json({ orgUsers });
});

// add-event POST route will add an event to the users
// and to the respective org, as well as sending every
// member of the organization a message of what the
// event is supposed to be
app.post(`/add-event/:name`, async (req, res) => {
  const { title, description, org } = req.body;
  try {
    const user = await User.findOne({ username: req.params.name });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const possibleOrg = await Org.findOne({ name: org });
    if (!possibleOrg) {
      return res.json({ message: "Org not found" });
    }

    if (possibleOrg.leaderName !== user.username) {
      return res.json({
        message: "Not the leader of the organization",
      });
    }

    const recipients = await User.find({
      _id: { $in: possibleOrg.people },
    }).select("_id");

    const recipientIds = recipients.map((recipient) =>
      recipient._id.toString()
    );

    const newEvent = new Event({
      title,
      description: description,
      creator: user._id,
      recipient: recipientIds,
    });

    possibleOrg.events.push(newEvent._id);

    for (const recipient of recipients) {
      const user = await User.findById(recipient._id);
      if (user) {
        user.events.push(newEvent._id);
        sendMessage(user.phoneNumber, "Event: " + title + ", " + description);
        await user.save();
      }
    }

    await possibleOrg.save();
    await newEvent.save();
  } catch (err) {
    return res.json({ message: "Error at adding event" });
  }
});

// Here is where the app listen to the port 80
app.listen(port, () => {
  console.log(`http://localhost:${80}`);
});
