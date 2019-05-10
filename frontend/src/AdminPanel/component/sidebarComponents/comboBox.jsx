import React, {Component} from 'react';
import $ from 'jquery';
import Auth from '../../../Auth';
import {Helmet} from 'react-helmet';

class ComboBox extends Component {
  state = {
    tableNames: [],
    selectName: 'Table Name',
  };

  componentDidMount() {
    // yaha table ke names fetch honge or tableNames me insert kerwana hai
    /* ===== Logic for creating fake Select Boxes ===== */

    ///
    fetch('http://localhost:5000/getTableName', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(function(res) {
        return res.json();
      })
      // string 253   int 3   float 4
      .then(response => {
        // this.fetchDataInStoreData(response); // this funtion to print fetch data in table
        console.log('xxxddd');
        console.log(response);
        console.log(response[0].table_name);
        let mtableNames = this.state.tableNames;
        let itr = 0;
        for (let j = 0; j < response.length; j++) {
          if (response[j].table_name !== 'users') {
            mtableNames[itr] = response[j].table_name;
            itr++;
          }
          continue;
        }
        this.setState({tableNames: mtableNames});

        this.props.fetchHandler(mtableNames[0]);
      })
      .catch(function(res) {
        console.log(res);
      });
  }
  selectTable = evt => {
    console.log('table name is  ' + evt.target.value);
  };
  selectHandler = evt => {
    console.log('taeger   ' + evt.target.value);
  };
  render() {
    return (
      <React.Fragment>
        <div className="custom-select">
          <br />
          Select Table
          <select
            style={{marginLeft: '7.5%'}}
            className="cellInput"
            id="Data-type"
            defaultValue={this.state.tableNames[0]}
            onChange={this.props.comboBoxValueHandler}
          >
            {this.state.tableNames.map((tableNames, index) => (
              <option key={index} value={tableNames}>
                {tableNames}
              </option>
            ))}
          </select>
          <br />
          <br />
        </div>

        {/* <button
          type="button"
          className="btn btn-primary zoomBtn"
          style={{paddingTop: 8, paddingRight: 9, paddingLeft: 9, paddingBottom: 8}}
          onClick={this.props.comboBoxSelectedValue}
        >
          Load Table
        </button> */}
      </React.Fragment>
    );
  }
}

export default ComboBox;
