import React, {Component} from 'react';
import NavBar from './component/navBar.jsx';
import SideMenu from './component/sideMenu.jsx';
import Main from './component/main.jsx';
import ModifyTable from './component/sidebarComponents/ModifyTable';
import ViewTable from './component/sidebarComponents/viewTable.jsx';
import CreateTable from './component/sidebarComponents/createTable.jsx';


class CreateTableUI extends Component {
  constructor() {
    super();
    let ss = this.state.row;
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
          <SideMenu callingComponent="desk" />

          {/* <!-- END LEFT SIDEBAR --> */}
          {/* <!-- MAIN --> */}
          <CreateTable />
          {/* <CreateTable /> */}
          {/* <ViewTable /> */}
          {/* <!-- END MAIN --> */}
          <div className="clearfix" />
          <footer>
            <div className="container-fluid" />
            Zybase CopyRights
          </footer>
        </div>
        {/* <!-- END WRAPPER --> */}
        {/* <!-- Javascript --> */}
      </React.Fragment>
    );
  }
}

export default CreateTableUI;
