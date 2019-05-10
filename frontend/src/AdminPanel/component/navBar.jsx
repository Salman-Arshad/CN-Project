import React, {Component} from 'react';
import {Link, withRouter, Redirect, BrowserHistory} from 'react-router-dom';

class NavBar extends Component {
  state = {
    redirect: false,
  };
  logout() {
    console.log(this.state.redirect);
    fetch('http://localhost:5000/logout', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        console.log(response);
        // this.props.history.push('/login');
        this.setState({redirect: true});
        console.log('zzzzzzzzzzzzzzzz', +this.state.redirect);
      })
      .catch(res => {
        console.log(res);
      });
    console.log('request sent');
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
    return (
      <React.Fragment>
        <nav className="navbar navbar-default navbar-fixed-top" style={{background: 'none'}}>
          <div className="brand" style={{background: 'none'}}>
            <a href="">
              {/* <img src="assets/img/logo-dark.png" alt="Klorofil Logo" className="img-responsive logo" /> */}
              <h2 style={{marginBottom: -11}}>ZYBASE</h2>
            </a>
          </div>
          <div className="container-fluid" style={{background: '#00000080'}}>
            <div id="navbar-menu">
              <ul className="nav navbar-nav navbar-right">
                <li className="nav-item">
                  <Link to={'/'}>
                    <a className="nav-link" href="#">
                      <span> Home</span>
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <Link to={'/'}>
                      <a className="nav-link" href="#">
                        <span> Contact Us</span>
                      </a>
                    </Link>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <Link to={'/'}>
                      <a className="nav-link" href="#">
                        <span> Pricing</span>
                      </a>
                    </Link>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <button onClick={this.logout.bind(this)} style={{marginBottom: -9}} className="btn btn-primary">
                      Logout
                    </button>
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#">
                        <i className="lnr lnr-user" /> <span>My Profile</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="lnr lnr-envelope" /> <span>Message</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="lnr lnr-cog" /> <span>Settings</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="lnr lnr-exit" /> <span>Logout</span>
                      </a>
                    </li>
                  </ul>
                </li>
                {/* <li>
                  <a
                    className="update-pro"
                    href="https://www.themeineed.com/downloads/klorofil-pro-bootstrap-admin-dashboard-template/?utm_source=klorofil&utm_medium=template&utm_campaign=KlorofilPro"
                    title="Upgrade to Pro"
                    target="_blank"
                  >
                    <i className="fa fa-rocket" /> <span>UPGRADE TO PRO</span>
                  </a>
                </li>{" "} */}
              </ul>
            </div>
          </div>
        </nav>
        {/* <!-- END NAVBAR --> */}
      </React.Fragment>
    );
  }
}

export default NavBar;
