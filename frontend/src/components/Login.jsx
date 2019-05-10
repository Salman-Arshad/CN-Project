import React, {Component} from 'react';
import {Link, withRouter, Redirect} from 'react-router-dom';
import {browserHistory} from 'react-router';
import Auth from '../Auth';
import {randomFill} from 'crypto';

class Login extends Component {
  state = {
    email: '',
    password: '',
    emailError: false,
    passwordError: false,
    alertStyle: {
      display: 'none',
    },
    loaded: false,
    isAuthenticated: false,
  };

  componentDidMount() {
    // if (this.props.location.state) {
    //   if (this.props.location.state.registerRedirect == true) {
    //     this.setState({
    //       alertStyle: {
    //         display: "block"
    //       }
    //     });
    //   }
    // } else {
    //   this.setState({
    //     alertStyle: {
    //       display: "none"
    //     }
    //   });
    // }
    console.log('SSSSS ' + Auth.isAuthenticated);
    Auth.authenticate((misAuthenticated, misLoaded) => {
      this.setState({loaded: misLoaded, isAuthenticated: misAuthenticated});
    });
    if (Auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  handleCredentialPostRequest() {
    fetch('http://localhost:5000/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then(function(res) {
        return res.json();
      })
      .then(response => {
        console.log(response);
        if (response.authenticate == 'true') {
          this.props.history.push('/dashboard');
          ///LOAD HOME PAGE
        } else if (response.authenticate === 'false') {
          console.log(response.message);
          // this.setState({ emailError: true, passwordError: true });
        } else {
          console.log('Serious Error');
        }
      })
      .catch(function(res) {
        console.log(res);
      });
    console.log('request sent');
  }

  handleLogin = () => {
    console.log(this.state.email + ' email:');
    console.log(this.state.password + ' password');
    this.validateInput();
  };
  validateInput = () => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
      console.log('valid email');
      if (this.state.password != '') {
        this.handleCredentialPostRequest(); //calling handleCredential
      } else {
        this.setState({passwordError: true});
      }
    } else {
      console.log('Invalid email');
      this.setState({emailError: true});
      if (this.state.password == '') {
        this.setState({passwordError: true});
      }
    }
  };

  onChange = ({target}) => {
    this.setState({
      [target.name]: target.value,
      emailError: false,
      passwordError: false,
    });
  };
  getPasswordClass = () => {
    if (this.state.passwordError == true) return 'wrap-input100 validate-input alert-validate';
    else {
      return 'wrap-input100 validate-input';
    }
  };
  getEmailClass = () => {
    if (this.state.emailError == true) return 'wrap-input100 validate-input alert-validate';
    else {
      return 'wrap-input100 validate-input';
    }
  };
  onEmailFieldClick = () => {
    //remove the class
    this.setState({emailError: false});
  };
  onPasswordFieldClick = () => {
    //remove the class
    this.setState({passwordError: false});
  };
  hideAlert = () => {
    this.setState({
      alertStyle: {
        display: 'none',
      },
    });
    this.props.history.replace({});
  };
  render() {
    if (Auth.isAuthenticated && Auth.isLoaded) {
      console.log('SSSSS ' + Auth.isAuthenticated);
      return <Redirect to="/dashboard" />;
    } else
      return (
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <div className="login100-pic js-tilt" data-tilt>
                <img className="imageOpacity" src="images/img-01.png" alt="IMG" />
              </div>

              <form className="login100-form validate-form">
                <div
                  className="alert alert-dismissible fade show alert-success cus-alert-pos "
                  style={this.state.alertStyle}
                >
                  <strong>Success! </strong>
                  Registered successfully, verify <strong>E-mail</strong> to proceed
                  <button onClick={this.hideAlert} type="button" className="close">
                    <span>&times;</span>
                  </button>
                </div>
                <span className="login100-form-title">Member Login</span>

                <div className={this.getEmailClass()} data-validate="Valid email is required: ex@abc.xyz">
                  <input
                    className="input100"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.onChange}
                    onClick={this.onEmailFieldClick}
                  />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-envelope" aria-hidden="true" style={{color: '#666666'}} />
                  </span>
                </div>
                <div className={this.getPasswordClass()} data-validate="Password is required">
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
                    <i className="fa fa-lock" aria-hidden="true" style={{color: '#666666'}} />
                  </span>
                </div>
                <div className="container-login100-form-btn">
                  <button type="button" className="login100-form-btn btn-primary zoomBtn" onClick={this.handleLogin}>
                    Login
                  </button>
                </div>
                <div className="text-center p-t-12">
                  <span className="txt1custom">Forgot </span>
                  <a className="txt2custom" style={{color: ' #209e91'}} href="#">
                    Username / Password?
                  </a>
                </div>
                <div className="text-center p-t-124">
                  <Link style={{color: ' #209e91'}} className="txt2custom" to="/register">
                    Create your Account
                    <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true" />
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
  }
}

export default Login;
