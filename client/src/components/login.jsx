// Jose Bernardo Montano
// Jaret Raymond Rickel
// Annie Corinne Beaupre

import React, { Component } from "react";

// Login component will make sure to provide the input form
// for the user to log in, as well as sending the data
// and if the token is present it is sent to the server for it
// to show us the home page
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      customMessage: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;

    // POST request
    fetch("/loginAccount", {
      method: "POST",
      crossDomain: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error === "Login details are incorrect") {
          this.setState({ customMessage: data.error });
          setTimeout(() => {
            this.setState({ customMessage: "" });
          }, 5000); // clear message after 5 sec
        } else {
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);
          this.setState({ customMessage: "Login has been successful!" });
          setTimeout(() => {
            this.setState({ customMessage: "" });
            window.location.href = "./home";
          }, 1000);
        }
      });
  }

  // send the user to sign-up page
  goToSignUp() {
    window.location.href = "./sign-up";
  }

  // renders the JSX code of the form
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
            Welcome back to Deadline!
          </h2>
          <h2 className="font-bold self-center mt-2 text-2xl text-gray-600">
            Login
          </h2>
          <div className="my-4">
            <p className="font-medium self-center text-gray-600">
              Welcome back! Please provide your email and password to log in.
            </p>
          </div>
          <div className="my-1 flex flex-col mb-2">
            <label className="font-bold my-1 text-sm">Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              onChange={(e) => this.setState({ email: e.target.value })}
              className="border border-gray-300 p-1 pl-4"
            />
          </div>
          <div className="my-2 flex flex-col mb-2">
            <label className="font-bold my-1 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              onChange={(e) => this.setState({ password: e.target.value })}
              className="border border-gray-300 p-1 pl-4"
            />
          </div>
          <div className="my-1 flex flex-col mb-2">
            <button
              className="border rounded-md mt-3 px-6 py-2 bg-blue-600 text-white 
              font-medium transition duration-300 ease-in-out hover:bg-blue-600 "
              type="submit"
            >
              Login
            </button>
          </div>
          <div>
            <button
              onClick={this.goToSignUp}
              className="font-bold my-1 text-sm text-gray-600"
            >
              Don't have an account? Create an account here
            </button>
          </div>
          <div className="my-2">
            <p className="font-bold self-center text-md text-gray-700">
              {this.state.customMessage}
            </p>
          </div>
        </form>
      </div>
    );
  }
}
