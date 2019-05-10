import React, { Component } from "react";
import { Link } from "react-router-dom";

class Register extends Component {
  state = {
    fullname: "",
    email: "",
    password: "",
    emailError: false,
    passwordError: false,
    failureMessage: "",
    alertVisiblity: false,
    fullnameError: false
  };

  componentDidMount() {}

  handleRegisterPostRequest() {
    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullname: this.state.fullname,
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(function(res) {
        return res.json();
      })
      .then(response => {
        console.log(response);
        if (response.statusCode == 400) {
          this.setState({
            alertVisiblity: true,
            failureMessage: response.message
          });
        } else {
          // this.props.history.push("/login");

          this.props.history.push({
            pathname: "/login",
            state: { registerRedirect: true }
          });
        }
      })
      .catch(function(res) {
        console.log(res);
      });
    console.log("request sent");
  }

  handleRegister = () => {
    console.log(this.state.fullname + " fullname");
    console.log(this.state.email + " email");
    console.log(this.state.password + " password");
    this.validateInput();
  };
  validateInput = () => {
    if (this.state.fullname == "") this.setState({ fullnameError: true });
    if (this.state.password.length < 5) {
      this.setState({ passwordError: true });
    }
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)
    ) {
      console.log("valid email");
      if (this.state.password.length >= 5) {
        //calling handleRegister
        if (this.state.fullname != "") this.handleRegisterPostRequest();
      }
    } else {
      console.log("Invalid email");
      this.setState({ emailError: true });
    }
  };

  onChange = ({ target }) => {
    this.setState({
      [target.name]: target.value,
      emailError: false,
      passwordError: false,
      alertVisiblity: false,
      fullnameError: false,
      failureMessage: ""
    });
  };
  getPasswordClass = () => {
    if (this.state.passwordError == true)
      return "wrap-input100 validate-input alert-validate";
    else {
      return "wrap-input100 validate-input";
    }
  };
  getEmailClass = () => {
    if (this.state.emailError == true)
      return "wrap-input100 validate-input alert-validate";
    else {
      return "wrap-input100 validate-input";
    }
  };
  getFullnameClass = () => {
    if (this.state.fullnameError == true)
      return "wrap-input100 validate-input alert-validate";
    else return "wrap-input100 validate-input";
  };
  getAlertVisiblity = () => {
    if (this.state.alertVisiblity == false) return { display: "none" };
    else return { display: true };
  };
  onEmailFieldClick = () => {
    //remove the class
    this.setState({ emailError: false });
  };
  onPasswordFieldClick = () => {
    //remove the class
    this.setState({ passwordError: false });
  };
  onFullnameFieldClick = () => {
    //remove the class
    this.setState({ fullnameError: false });
  };
  render() {
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div className="login100-pic js-tilt" data-tilt>
              <img className="imageOpacity" src="images/img-01.png" alt="IMG" />
            </div>

            <form className="login100-form validate-form">
              <span className="login100-form-title">Member Register</span>
              <div
                className={this.getFullnameClass()}
                data-validate="Valid email is required: ex@abc.xyz"
              >
                <input
                  className="input100"
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={this.state.fullname}
                  onChange={this.onChange}
                  onClick={this.onFullnameFieldClick}
                />
                <span className="focus-input100" />
                <span className="symbol-input100">
                  <i className="fa fa-user-circle-o" aria-hidden="true" />
                </span>
              </div>
              <div
                className={this.getEmailClass()}
                data-validate="Valid email is required: ex@abc.xyz"
              >
                <input
                  className="input100"
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.onChange}
                  onClick={this.onEmailFieldClick}
                />
                <span className="focus-input100" />
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true" />
                </span>
              </div>

              <div
                className={this.getPasswordClass()}
                data-validate="Length should be greater than 5 characters"
              >
                <input
                  className="input100"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                  onClick={this.onPasswordFieldClick}
                />
                <span className="focus-input100" />
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true" />
                </span>
              </div>

              <div className="container-login100-form-btn">
                <button
                  type="button"
                  className="login100-form-btn"
                  onClick={this.handleRegister}
                >
                  Register
                </button>
              </div>
              <div
                className="alert alert-danger m-t-20 "
                role="alert"
                style={this.getAlertVisiblity()} //{ display: "none" }
              >
                {this.state.failureMessage}
              </div>
              <div className="text-center p-t-100">
                <Link className="txt2custom" to="/login">
                  Already have an Account?
                  <i
                    className="fa fa-long-arrow-right m-l-5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </form>
          </div>
        </div>
        <script src="./main.js" />
      </div>
    );
  }
}

export default Register;
