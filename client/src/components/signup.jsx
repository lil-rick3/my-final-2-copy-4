// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { Component } from "react";

// SignUp component is a form for traffic to create a user
// and it will send them directly to log in after that
export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      serverMessage: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Handler
  handleSubmit(e) {
    e.preventDefault();
    const { username, firstName, lastName, phoneNumber, email, password } =
      this.state;
    fetch("/createAccount", {
      method: "POST",
      crossDomain: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "ok") {
          this.setState({ serverMessage: "Account has been created" });
          setTimeout(() => {
            this.goToLogin();
          }, 5000); // go to login after 5 seconds
        }
      })
      .catch((err) => {
        this.setState({ serverMessage: "Error at server" });
      });
  }

  // Send the user to the login page
  goToLogin() {
    window.location.href = "./login";
  }

  // Return the render jsx code
  render() {
    return (
      <div
        className="min-h-screen flex flex-col items-center
       justify-center bg-blue-400"
      >
        <form
          onSubmit={this.handleSubmit}
          className="flex flex-col
          bg-white
          shadow-md
          px-4
          sm:px-6
          md:px-8
          lg:px-10
          py-8
          rounded-2xl
          w-100
          max-w-xl"
        >
          <h2 className="font-medium self-center text-3xl text-gray-600 ">
            Welcome to Deadline
          </h2>
          <h2 className="font-bold self-center mt-2 text-2xl text-gray-600 ">
            Sign Up
          </h2>
          <div className="my-4">
            <p className="font-medium self-center text-gray-600">
              Please provide your information to create an account.
            </p>
          </div>
          <div className="my-1 flex flex-col mb-2">
            <label className="font-bold my-1 text-sm">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              onChange={(e) => this.setState({ username: e.target.value })}
              className="border border-gray-300 p-1 pl-4"
              required
            />
          </div>
          <div className="my-1 flex flex-col mb-2">
            <label className="font-bold my-1 text-sm">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              onChange={(e) => this.setState({ firstName: e.target.value })}
              className="border border-gray-300 p-1 pl-4"
              required
            />
          </div>
          <div className="my-1 flex flex-col mb-2">
            <label className="font-bold my-1 text-sm">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              onChange={(e) => this.setState({ lastName: e.target.value })}
              className="border border-gray-300 p-1 pl-4"
              required
            />
          </div>
          <div className="my-1 flex flex-col mb-2">
            <label className="font-bold my-1 text-sm">Phone Number</label>
            <label className="font-bold my-1 text-sm">
              *Make sure to follow the format: 1234567890
            </label>
            <input
              type="tel"
              placeholder="Enter phone number:"
              pattern="[0-9]{10}"
              maxLength="10"
              onChange={(e) => this.setState({ phoneNumber: e.target.value })}
              className="border border-gray-300 p-1 pl-4"
              required
            />
          </div>
          <div className="my-1 flex flex-col mb-2">
            <label className="font-bold my-1 text-sm">Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              onChange={(e) => this.setState({ email: e.target.value })}
              className="border border-gray-300 p-1 pl-4"
              required
            />
          </div>
          <div className="my-1 flex flex-col mb-2">
            <label className="font-bold my-1 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              onChange={(e) => this.setState({ password: e.target.value })}
              className="border border-gray-300 p-1 pl-4"
              required
            />
          </div>
          <div className="my-1 flex flex-col mb-2">
            <button
              type="submit"
              className="border rounded-md mt-3 px-6 py-2 bg-blue-600 text-white 
              font-medium transition duration-300 ease-in-out hover:bg-blue-600"
            >
              Sign Up
            </button>
          </div>
          <div>
            <button
              onClick={this.goToLogin}
              className="font-bold my-1 text-sm text-gray-600"
            >
              Already have an account? Log in here
            </button>
            {this.state.serverMessage === "Account has been created" && (
              <div>
                <div className="font-bold my-1 text-sm text-gray-600">
                  {this.state.serverMessage}
                </div>
                <div className="font-bold my-1 text-sm text-gray-600">
                  We will redirect you soon...
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }
}
