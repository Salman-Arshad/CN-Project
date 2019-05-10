import React, {Component} from 'react';
import Rows from './Rows.jsx';
import ComboBox from './comboBox.jsx';
import Auth from '../../../Auth.js';
import Queries from '../../../tableQueries.js';

import $ from 'jquery';

class ViewTable extends Component {
  state = {
    header1: [],
    icol: 0,
    irow: 0,
    header: [],
    defaultComboTable: '',
    showTerminalTable: 'no',
    storeData: [
      [
        // {
        //   id: '0',
        //   colName: '',
        //   pk: '',
        //   defaultValue: '0',
        //   value: '',
        //   size: '',
        //   autoInc: '',
        //   type: '',
        //   notNull: '',
        //   unique: '',
        // },
        // {
        //   id: '1',
        //   colName: '',
        //   pk: '0',
        //   defaultValue: '',
        //   value: '',
        //   size: '',
        //   autoInc: '',
        //   type: 'STRING',
        //   notNull: '',
        //   unique: '',
        // },
      ],
    ],
  };
  componentDidMount() {
    if (this.props.showTerminalTable === 'yes') {
      this.fetchDataInStoreData(this.props.tableData);
    }
  }
  fetchDataInStoreData(response) {
    let header = [],
      storeData = [[]],
      mainArr = [],
      i = 0;
    let j = 0;
    let colDetails = {};
    let header3 = [];
    // this.setState({header: []});

    let headerArr = [];
    let header2 = [...this.state.header1]; // new header added with properties
    for (j = 0; j < response.column.length; j++) {
      header[j] = response.column[j].name;
    }

    this.setState({header: header});

    //yaha exception lagegi ager rows na hue tw
    if (response.data[0] === undefined || response.data[0] === null) {
      // this.setState({storeData: []});
      console.log('table is empty');
      // return alert(this.state.tableName + ' is empty');
    }
    let arr = response.data[0];

    let colObject = Object.entries(arr);
    let defaultValue = colObject[0][1];
    // let colName = colObject[j][0];
    // console.log(response.column);

    for (i = 0; i < response.column.length; i++) {
      for (let m = 0; m < response.primaryKey.length; m++) {
        if (response.primaryKey[m] === response.column[i].name) {
          headerArr.pk = '1';
        } else {
          headerArr.pk = '0';
        }
      }
      if (response.column[i].type === 3) {
        headerArr.type = 'Number';
      }
      if (response.column[i].type === 4) {
        headerArr.type = 'Float';
      }
      if (response.column[i].type === 253) {
        headerArr.type = 'STRING';
      }
      headerArr.id = String(i);
      headerArr.colName = response.column[i].name;
      headerArr.size = response.column[i].length;
      // console.log('col name is   ' + response.column[i].name);
      header3.push(headerArr);
      console.log('asdasd here  sssssssllllllllllllllllllll');

      console.log(this.state.header1);

      headerArr = [];
    }
    this.setState({header1: header3});

    for (let k = 0; k < response.data.length; k++) {
      storeData = [];
      let arr = response.data[k];
      colObject = Object.entries(arr);
      for (let j = 0; j < colObject.length; j++) {
        let defaultValue = colObject[j][1];
        let colName = colObject[j][0];
        colDetails.id = String(k + j);
        colDetails.value = defaultValue;
        colDetails.defaultValue = defaultValue;
        colDetails.colName = colName;
        colDetails.size = response.column[j].length;

        if (response.column[j].type === 3) {
          colDetails.type = 'Number';
          // headerArr.type = 'Number';
        }
        if (response.column[j].type === 4) {
          colDetails.type = 'Float';
          // headerArr.type = 'Float';
        }
        if (response.column[j].type === 253) {
          colDetails.type = 'STRING';
          // headerArr.type = 'STRING';
        }

        for (let m = 0; m < response.primaryKey.length; m++) {
          if (response.primaryKey[m] === colName) {
            colDetails.pk = '1';
          } else {
            colDetails.pk = '0';
          }
        }
        storeData.push(colDetails);
        colDetails = {};
      }
      mainArr.push(storeData);
    }
    console.log(this.state.storeData);
    // empty the array
    let storeData1 = [];
    let header1 = [];

    //set new array in array
    this.setState({icol: colObject.length});
    this.setState({irow: response.data.length});
    this.setState({storeData: []});
    this.setState({storeData: mainArr});
  }
  fetchHandler(selectedTable) {
    fetch('http://localhost:5000/getTable', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableName: selectedTable,
      }),
    })
      .then(function(res) {
        return res.json();
      })
      // string 253   int 3   float 4
      .then(response => {
        this.fetchDataInStoreData(response); // this funtion to print fetch data in table
      })
      .catch(function(res) {
        console.log(res);
      });
    console.log('request sent');
  }

  comboBoxValueHandler = evt => {
    // console.log(evt.target.value);

    let selectedTable = evt.target.value;
    let storeData = [];
    let header = [];
    this.setState({header: header});
    this.setState({storeData: storeData});
    this.fetchHandler(selectedTable);
  };
  inputField(index, header) {
    if (this.state.header1[index] !== undefined) {
      if (this.state.header1[index].pk === '1') {
        return (
          <div>
            <i className="fa fa-key" style={{marginRight: '10px', color: 'yellow'}} />
            {header}
          </div>
        );
      }
    }
    return header;
  }
  printTable() {
    return (
      <table id="tableId">
        <tbody>
          {/*%%%%%%%%%%%%%%%%%%%% header DOM working %%%%%%%%%%%%%%*/}
          <tr className="header">
            {this.state.header.map((header, index) => (
              <th key={index}>{this.inputField(index, header)}</th>
            ))}
          </tr>
          {/*%%%%%%%%%%%%%%%%%%%% End header DOM working %%%%%%%%%%%%%%*/}

          {/*%%%%%%%%%%%%%%%%%%%% Table Rows/columns DOM working %%%%%%%%%%%%%%*/}
          {this.state.storeData.map((yo, index) => (
            <Rows key={String(index)} index={index} id={String(index)} storeData={this.state.storeData} />
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.props.showTerminalTable === 'no' ? (
          <div className="main">
            {/* <!-- MAIN CONTENT --> */}
            <div className="main-content">
              <div className="container-fluid">
                {/* {/* <!-- OVERVIEW --> */}
                <div className="panel panel-headline">
                  <div className="panel-heading">
                    <div className="panel-title">
                      <h3>
                        Select Table
                        <ComboBox
                          defaultComboTable={this.state.defaultComboTable}
                          comboBoxValueHandler={this.comboBoxValueHandler}
                          fetchHandler={this.fetchHandler.bind(this)}
                        />
                      </h3>

                      {/* <div>{this.fetchDataInStoreData(this.props.tableData)}</div> */}
                    </div>

                    {/* <p className="panel-subtitle">Period: Oct 14, 2016 - Oct 21, 2016</p> */}
                  </div>
                  <div className="panel-body">
                    {/* <ComboBox /> */}

                    {/* table body */}
                    {this.printTable()}
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- END MAIN CONTENT --> */}
          </div>
        ) : (
          <div>{this.printTable()}</div>
        )}
      </React.Fragment>
    );
  }
}

export default ViewTable;
