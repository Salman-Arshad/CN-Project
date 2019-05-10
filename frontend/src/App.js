import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import PrivateRoute from './PrivateRoute';
import PrivateDashboard from './components/PrivateDashboard';
import Auth from './Auth';
import Dashboard from './AdminPanel/Admin';
import CreateTableUI from './AdminPanel/CreateTableUI';
import Terminal from './AdminPanel/component/terminal';
import viewTableUI from './AdminPanel/viewTableUI';
import comp1 from './AdminPanel/component/main';
import ModifyTableUI from './AdminPanel/ModifyTableUI';
import asyncComponent from './components/AsyncComponent';
import SettingsPanelUI from './AdminPanel/settingsPanelUI';
import Notifications from './AdminPanel/component/Notifications';
const myHome = asyncComponent(() => import('./AdminPanel/Admin').then(module => module.default));

// const Maps = asyncComponent(() => import('./Maps/Maps').then(module => module.default));

// const Blog = asyncComponent(() => import('./Blog/Blog').then(module => module.default));
class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route
              path="/logout"
              render={() => {
                Auth.signout();
                return <Redirect to="/" />;
              }}
            />
            <PrivateRoute path="/private-dashboard" component={PrivateDashboard} />
            <PrivateRoute path="/terminal" component={Terminal} />
            <PrivateRoute path="/dashboard" component={myHome} />
            <PrivateRoute path="/view" component={viewTableUI} />
            <PrivateRoute path="/modify" component={ModifyTableUI} />
            <PrivateRoute path="/create" component={CreateTableUI} />
            <PrivateRoute path="/setting" component={SettingsPanelUI} />
            <PrivateRoute path="/notifications" component={Notifications}/>

            <Route path="/test" component={comp1} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
