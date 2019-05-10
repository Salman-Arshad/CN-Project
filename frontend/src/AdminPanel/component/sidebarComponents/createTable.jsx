import React, {Component} from 'react';
import Queries from '../../../tableQueries.js';
import ModifyTable from './ModifyTable.jsx';
import {Link, withRouter, Redirect, BrowserHistory} from 'react-router-dom';
// import SweetAlert from './sweetAlert';
// import SweetAlert from 'sweetalert-react';
import $ from 'jquery';
import ModalPopup from './modalPopup.jsx';

class CreateTable extends Component {
  state = {
    tableName: '',
    header: ['Id  (auto)', 'Name', 'Action'],
    redirect: false,
  };
  tableNameChangeHandler = evt => {
    this.setState({tableName: evt.target.value});
  };
  createTableQueryHandler() {
    if (this.state.tableName === '') {
      // document.getElementById('myCheck').click();
      return alert('fill out the field');
    } else {
      console.log(Queries.createTable(this.state, this.state.tableName));
      let tableQuery = Queries.createTable(this.state, this.state.tableName);
      // ModifyTable.createTableQueryHandler(tableQuery, this.state.ta);
      this.QueryExecuteHandler(tableQuery, this.state.tableName);
      this.setState({tableName: ''});
    }
  }
  QueryExecuteHandler(tableQuery, tableName) {
    console.log(tableQuery);
    fetch('http://localhost:5000/tableQueryExecute', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableQuery: tableQuery,
        tableName: tableName,
      }),
    })
      .then(function(res) {
        return res.json();
      })
      // string 253   int 3   float 4
      .then(response => {
        console.log('here respoe');
        console.log(response);
        // setTimeout(() => {
        // },1000);
        this.setState({redirect: true});
        console.log('________________' + this.state.redirect);
        // this.fetchDataInStoreData(response); // this funtion to print fetch data in table
      })
      .catch(function(res) {
        console.log(res);
      });
    console.log('request sent');
  }
  render() {
    if (this.state.redirect) return <Redirect to="/modify" />;
    return (
      <React.Fragment>
        <div className="main">
          {/* <!-- MAIN CONTENT --> */}
          <div className="main-content">
            <div className="container-fluid">
              {/* {/* <!-- OVERVIEW --> */}
              <div className="panel panel-headline">
                <div className="panel-heading">
                  <div className="panel-title">
                    <h3>Create Table</h3>
                  </div>
                  {/* <p className="panel-subtitle">Period: Oct 14, 2016 - Oct 21, 2016</p> */}
                </div>
                <div className="panel-body">
                  {/* <form  onSubmit={this.createTableQueryHandler.bind(this)}> */}
                  <label style={{color: 'white'}}>Enter Table Name</label>
                  <input
                    placeholder="Table Name"
                    onChange={this.tableNameChangeHandler}
                    type="text"
                    value={this.state.tableName}
                    className="cellInput"
                    autoFocus
                    required
                  />

                  <br />
                  <br />
                  <button
                    type="submit"
                    className="btn btn-primary zoomBtn"
                    onClick={this.createTableQueryHandler.bind(this)}
                  >
                    Create
                  </button>

                  {/* </form> */}
                </div>
              </div>
            </div>
          </div>
          {/* <!-- END MAIN CONTENT --> */}
        </div>
      </React.Fragment>
    );
  }
}

export default CreateTable;
