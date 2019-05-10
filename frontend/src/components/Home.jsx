import React, { Component } from "react";
import logo from "../logo.svg";
import { Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ textAlign: "center", marginTop: 15 }}>
            <p>Please Login To Continue</p>
            <button className="btn btn-primary">
              <Link style={{ color: "#fff" }} to="/login">
                Login
              </Link>
            </button>
            <button
              className="btn btn-primary"
              style={{ marginLeft: 20, color: "#fff" }}
            >
              <Link style={{ color: "#fff" }} to="/dashboard">
                Dashboard
              </Link>
            </button>
            <button className="btn btn-primary" style={{ marginLeft: 20 }}>
              <Link style={{ color: "#fff" }} to="/create">
                Create Table
              </Link>
            </button>
            <img
              src={logo}
              className="center App-logo"
              alt="logo"
              style={{
                width: 500,
                height: 500,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                width: "50%"
              }}
            />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
