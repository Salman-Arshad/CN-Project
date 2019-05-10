import React, {Component} from 'react';
import NavBar from './component/navBar.jsx';
import SideMenu from './component/sideMenu.jsx';
import Main from './component/main.jsx';
import ModifyTable from './component/sidebarComponents/ModifyTable';

class Admin extends Component {
  constructor() {
    super();
    let ss = this.state.row;
  }
  componentDidMount() {
    document.getElementById('mainbody').style.overflow = 'auto';
  }
  state = {
    row: ['row', 'row2'],
  };

  render() {
    return (
      <React.Fragment>
        <div id="wrapper">
          {/* <!-- NAVBAR --> */}
          <NavBar />
          {/* end of navBar */}
          {/* <!-- LEFT SIDEBAR --> */}
          <SideMenu callingComponent="dashboard" />
          {/* <!-- END LEFT SIDEBAR --> */}
          {/* <!-- MAIN --> */}
          {/* <CreateTable /> */}
          <Main />
          {/* <!-- END MAIN --> */}
          <div className="clearfix" />
          <footer>
            <div className="container-fluid">
              <p className="copyright">
                &copy; 2018{' '}
                <a href="#" target="_blank">
                  Zybase
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

export default Admin;
