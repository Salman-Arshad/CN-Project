import React, {Component} from 'react';
import {Link, withRouter, Redirect} from 'react-router-dom';

class SideMenu extends Component {
  state = {
    cuurentComponent: '',
  };
  componentDidMount() {
    this.setState({cuurentComponent: this.props.callingComponent});
  }
  getActiveClassName = type => {
    console.log(type + '     ' + this.state.cuurentComponent);
    if (type == this.state.cuurentComponent) {
      return 'active';
    }
    if (type == 'desk' && this.state.cuurentComponent != 'desk') {
      console.log('asdasdsa');
      return 'collapsed collaspse collapse';
    }
    return '';
  };
  render() {
    return (
      <React.Fragment>
        <div id="sidebar-nav" className="sidebar">
          <div className="sidebar-scroll">
            <nav>
              <ul className="nav">
                <li>
                  <Link name="dashboard" className={this.getActiveClassName('dashboard')} to="/dashboard">
                    <i className="lnr lnr-home" /> <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <a
                    name="desk"
                    href="#subPages"
                    data-toggle="collapse"
                    className={this.getActiveClassName('desk')}
                    aria-expanded="false"
                  >
                    <i className="lnr lnr-file-empty" />
                    <span>Desk</span> <i className="icon-submenu lnr lnr-chevron-left" />
                  </a>
                  <div id="subPages" className={this.getActiveClassName('desk')}>
                    <ul className="nav" style={{background: 'none'}}>
                      <li>
                        <Link className="" style={{background: '#ffffff0d'}} to="/create">
                          Create Table
                        </Link>
                      </li>
                      <li>
                        <Link to="/modify" className="" style={{background: '#ffffff0d'}}>
                          Modify Table
                        </Link>
                      </li>
                      <li>
                        <Link to="/view" className="" style={{background: '#ffffff0d'}}>
                          View Table
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                {/* <li>
                  <Link name="analytics" to="/dashboard" className={this.getActiveClassName('analytics')}>
                    <i className="lnr lnr-chart-bars" /> <span>Analytics</span>
                  </Link>
                </li> */}
                <li>
                  <Link name="settingpanel" to="/setting" className={this.getActiveClassName('settingpanel')}>
                    <i className="lnr lnr-user" /> <span> User Profile</span>
                  </Link>
                </li>
                <li>
                  <Link name="Terminal" to="/terminal" className={this.getActiveClassName('Terminal')}>
                    <i className="lnr lnr-code" /> <span> Terminal</span>
                  </Link>
                </li>
                <li>
                  <Link name="Notifications" to="/notifications" className={this.getActiveClassName('Notifications')}>
                    <i className="lnr lnr-bubble" /> <span> Send Notification</span>
                  </Link>
                </li>
                {/* Start of push Notificcation */}
                {/* <li>
                  <a href="notifications.html" className="">
                    <i className="lnr lnr-alarm" /> <span>Push Notifications</span>
                  </a>
                </li> */}
                {/* End of  Push Notification */}
              </ul>
            </nav>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SideMenu;
