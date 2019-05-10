import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import NavBar from './component/navBar';
import SideMenu from './component/sideMenu.jsx';
import SettingsPanel from'./component/settingsPanel';

class SettingsPanelUI extends Component {

  
  render() {
    return (
      <React.Fragment>
        <div id="wrapper">
          {/* <!-- NAVBAR --> */}
          <NavBar />
          {/* end of navBar */}
          {/* <!-- LEFT SIDEBAR --> */}
          {/* <!-- END LEFT SIDEBAR --> */}
          {/* <!-- MAIN --> */}
          <SideMenu callingComponent="settingsPanel" />

          {/* <CreateTable /> */}
            <SettingsPanel/>
          {/* <!-- END MAIN --> */}

          <div className="clearfix" />
          <footer>
            <div className="container-fluid">
              <p className="copyright">
                &copy; 2017{' '}
                <a href="https://www.themeineed.com" target="_blank">
                  Theme I Need
                </a>
                . All Rights Reserved.
              </p>
            </div>
          </footer>
        </div>
        {/* <!-- END WRAPPER --> */}
        {/* <!-- Javascript --> */}
      </React.Fragment>
    );
  }
}
export default SettingsPanelUI;
