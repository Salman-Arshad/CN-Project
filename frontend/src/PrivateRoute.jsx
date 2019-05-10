import React from "react";
import {
  withRouter,
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router
} from "react-router-dom";
import Auth from "./Auth";

class PrivateRoute extends React.Component {
  state = {
    loaded: false,
    isAuthenticated: false
  };
  componentDidMount() {
    Auth.authenticate((misAuthenticated, misLoaded) => {
      console.log("sa" + misAuthenticated + "  a" + misLoaded);
      this.setState({ loaded: misLoaded, isAuthenticated: misAuthenticated });
    });
  }
  render() {
    const { component: Component, ...rest } = this.props;
    const { loaded, isAuthenticated } = this.state;
    if (!loaded) return null;
    return (
      <Route
        {...rest}
        render={props => {
          return isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login"
              }}
            />
          );
        }}
      />
    );
  }
}

export default PrivateRoute;
