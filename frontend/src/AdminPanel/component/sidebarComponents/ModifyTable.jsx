import React, {Component} from 'react';
import Rows from './Rows.jsx';
import ModalPopup from './modalPopup.jsx';
import Queries from '../../../tableQueries.js';
import Auth from '../../../Auth.js';
import ComboBox from './comboBox.jsx';
// import { connect } from "r";
import validator from 'react-validation';
import {validate, ValidationIn} from 'simple-react-validator';
import {realpath} from 'fs';
// import Columns from "./columns.jsx";
// import { AvForm, AvField } from "availity-reactstrap-validation";

class ModifyTable extends Component {
  constructor(props) {
    super(props);
    // this.crossBtnClickHandler = this.crossBtnClickHandler.bind(this);
  }

  state = {
    newColumnAttr: {
      id: '',
      defaultValue: '',
      size: 0,
      autoInc: '',
      type: 'STRING',
      notNull: '',
      unique: '',
      pk: '0',
    },
    tableName: '',
    offModalpopup: 'on',
    pkDecide: '',
    datatarget: '',
    lengthDisableStatus: 0,
    inputisEditableIndex: 0,
    inputisEditableFlag: 'true',
    editFlag: 0,
    editRowIndex: -9,
    headerEditedValue: '',
    setIndex: 0,
    num: 0,
    flag: 0,
    irow: 0,
    icol: 0,
    newHeader: '',
    newVal: '',
    checkBhund: 0,
    show: 'yes',
    // empty: [[{ id: "1", value: "2" }]],
    storeData: [[]],
    header: [],
    header1: [
      //   {id: '', colName: 'Id  (auto)', defaultValue: '', size: 0, autoInc: '', type: 'STRING', pk: '0'},
      //   {id: '', colName: 'Action', defaultValue: '', size: 0, autoInc: '', type: 'STRING', pk: '0'},
    ],
    // columns: [],
    // row: [{ id: 1, value: 2 }]
  };
  componentDidMount() {
    this.setState({storeData: []});
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
        // console.log(response);
        // console.log(response[0].table_name);
        this.fetchHandler(response[0].table_name);
      })
      .catch(function(res) {
        console.log(res);
      });
  }

  saveEditInputHandler(evt) {
    let editFlag = this.state.editFlag;
    editFlag = 0;
    this.setState({editFlag: editFlag});

    let inputisEditableFlag = this.state.inputisEditableFlag;
    inputisEditableFlag = 'true';
    this.setState({inputisEditableFlag: inputisEditableFlag});
    console.log(Queries.modifyRow(this.state.tableName, this.state.editRowIndex, this.state)); //change abc to tablename
    var tableQuery = Queries.modifyRow(this.state.tableName, this.state.editRowIndex, this.state);
    this.QueryExecuteHandler(tableQuery, this.state.tableName);
  }
  editRow(evt) {
    // console.log("evt " + evt.target.id);
    let editFlag = this.state.editFlag;
    editFlag = 1;
    this.setState({editFlag: editFlag});
    let editRowIndex = this.state.editRowIndex;
    editRowIndex = evt.target.id;
    this.setState({editRowIndex: editRowIndex});

    let inputisEditableFlag = this.state.inputisEditableFlag;
    inputisEditableFlag = 'false';
    this.setState({inputisEditableFlag: inputisEditableFlag});

    let inputisEditableIndex = this.state.inputisEditableIndex;
    inputisEditableIndex = evt.target.id;
    this.setState({inputisEditableIndex: inputisEditableIndex});
  }
  addDltEdtBtn(index) {
    // console.log(this.state.editRowIndex);
    let edit = this.state.editRowIndex;
    if (this.state.editFlag === 1 && parseInt(edit) === parseInt(index)) {
      return (
        <button
          id={this.index}
          className="btn btn-success btn-ripple zoomBtn"
          style={{margin: 5}}
          onClick={this.saveEditInputHandler.bind(this)}
        >
          Save
        </button>
      );
    } else {
      return (
        <button
          id={index}
          className="btn btn-primary btn-ripple zoomBtn"
          style={{margin: 5}}
          onClick={this.editRow.bind(this)}
        >
          Edit
        </button>
      );
    }
  }
  loopPrint() {
    // console.log("yes");
    for (let i = 0; i < this.state.storeData.length; i++) {
      // console.log(this.state.storeData);
      for (let j = 0; j <= this.state.storeData.length; j++) {
        console.log(this.state.storeData[i][j]);
      }
    }
  }
  handleValueChange(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value,
      rowIndex: evt.target.name,
    };
    // const re = /^[0-9\b]+$/;
    let columns = this.state.storeData;
    columns[parseInt(item.name)][parseInt(item.id)].value = item.value;
    this.setState({storeData: columns});
    // console.log(item.id + "  " + item.rowIndex);
  }
  handleRowDelete(evt) {
    const index = evt.target.id;
    let tableQuery = Queries.deleteRow(this.state.tableName, this.state.storeData[index][0].value, this.state);

    this.QueryExecuteHandler(tableQuery, this.state.tableName);
  }
  modifyColumnHandler = evt => {
    evt.preventDefault();
    let oldColumnName;
    let storeData = [...this.state.storeData];
    let header = [...this.state.header];
    let headerWithProps = [...this.state.header1];
    let pkPrevious = headerWithProps[this.state.setIndex].pk;
    let tableQuery;

    header[this.state.setIndex] = this.state.newHeader;
    this.setState({header: header});
    oldColumnName = headerWithProps[this.state.setIndex].colName;
    headerWithProps[this.state.setIndex].pk = this.state.newColumnAttr.pk;
    headerWithProps[this.state.setIndex].colName = this.state.newHeader;
    headerWithProps[this.state.setIndex].size = this.state.newColumnAttr.size;
    headerWithProps[this.state.setIndex].type = this.state.newColumnAttr.type;
    headerWithProps[this.state.setIndex].value = this.state.newColumnAttr.defaultValue;
    headerWithProps[this.state.setIndex].defaultValue = this.state.newColumnAttr.defaultValue;

    if (storeData.isEmpty === false) {
      for (let i = 0; i < this.state.irow; i++) {
        console.log('previous  ' + pkPrevious + '  new ' + this.state.newColumnAttr.pk);
        storeData[i][this.state.setIndex].pk = this.state.newColumnAttr.pk;
        storeData[i][this.state.setIndex].colName = this.state.newHeader;
        storeData[i][this.state.setIndex].size = this.state.newColumnAttr.size;
        storeData[i][this.state.setIndex].type = this.state.newColumnAttr.type;
        storeData[i][this.state.setIndex].value = this.state.newColumnAttr.defaultValue;
        storeData[i][this.state.setIndex].defaultValue = this.state.newColumnAttr.defaultValue;
      }
    }
    let pkDecide = [],
      k = 0;
    for (let j = 0; j < this.state.icol; j++) {
      if (headerWithProps[this.state.setIndex].pk === '1') {
        pkDecide[k] = this.state.storeData[0][j].colName;
        console.log('nafix desice');
        console.log(pkDecide[k]);
        k++;
      }
    }
    if (pkPrevious === '1' && headerWithProps[this.state.setIndex].pk === '0') {
      tableQuery = Queries.alterColumn(
        this.state.tableName,
        oldColumnName,
        this.state.newHeader,
        this.state,
        this.state.setIndex,
        '-1',
        pkDecide,
        headerWithProps
      );
    } else if (headerWithProps[this.state.setIndex].pk === '1') {
      tableQuery = Queries.alterColumn(
        this.state.tableName,
        oldColumnName,
        this.state.newHeader,
        this.state,
        this.state.setIndex,
        '1',
        pkDecide,
        headerWithProps
      );
    } else {
      tableQuery = Queries.alterColumn(
        this.state.tableName,
        oldColumnName,
        this.state.newHeader,
        this.state,
        this.state.setIndex,
        '0',
        pkDecide,
        headerWithProps
      );
    }
    this.setState({setIndex: 0});
    this.setState({header1: headerWithProps});
    this.QueryExecuteHandler(tableQuery, this.state.tableName);
    console.log(tableQuery);
    // this.change(storeData);
    // this.setState({storeData: storeData});

    evt.target.reset();
    this.resetForm();

    // this.setState({ storeData: storeData });
  };
  change = storeData => {
    // this.setState({ header: header });
    this.setState({storeData: storeData});
  };
  addHeaderHandler(evt) {
    evt.preventDefault();
    let num = this.state.num;
    num++;
    this.setState({num: num});
    let headerArr = [];
    let header1 = [...this.state.header1]; // new header added with properties
    let lastIndex = {id: '', colName: 'Action', defaultValue: '', size: 0, autoInc: '', type: '', pk: '0'};

    headerArr.colName = this.state.header;
    headerArr.id = num + '';
    headerArr.colName = this.state.newHeader;
    headerArr.pk = String(this.state.newColumnAttr.pk);
    headerArr.defaultValue = this.state.newColumnAttr.defaultValue;
    headerArr.value = this.state.newColumnAttr.value;
    headerArr.size = this.state.newColumnAttr.size;
    headerArr.type = this.state.newColumnAttr.type;

    header1 = header1.splice(0, this.state.header1.length - 1);
    header1.push(headerArr);
    header1.push(lastIndex);
    console.log(header1);
    // this.setState({header1: []});
    this.setState({header1: header1});
    let header = [...this.state.header];
    header[header.length] = header[header.length - 1];
    header[header.length - 2] = this.state.newHeader;

    this.setState({header: header});
    let newVal = this.state.newVal;

    this.addColHandler(newVal);
    evt.target.reset();
    this.resetForm();
  }

  printHeader() {}
  addRowHandler = rows => {
    //ADD ROW HANDLER

    let tableQuery = Queries.insertRows(this.state, this.state.tableName, irow);
    console.log(tableQuery);
    this.QueryExecuteHandler(tableQuery, this.state.tableName);
    // let reArr = this.state.storeData;
    // let reNew = [];
    // let reN = [];
    // console.log("asdsa" + reArr);
    // for (let k = 0; k < this.state.icol; k++) {
    //   if (k === 0) {
    //     reN = {
    //       id: this.state.irow + '',
    //       colName: reArr[0][k].colName,
    //       pk: reArr[0][k].pk,
    //       defaultValue: reArr[0][k].defaultValue,
    //       value: this.state.irow,
    //       size: reArr[0][k].size,
    //       autoInc: reArr[0][k].autoInc,
    //       type: reArr[0][k].type,
    //       notNull: reArr[0][k].notNull,
    //       unique: reArr[0][k].unique,
    //     };
    //   } else {
    //     reN = {
    //       id: k + '',
    //       colName: reArr[0][k].colName,
    //       pk: reArr[0][k].pk,
    //       defaultValue: reArr[0][k].defaultValue,
    //       value: reArr[0][k].defaultValue,
    //       size: reArr[0][k].size,
    //       autoInc: reArr[0][k].autoInc,
    //       type: reArr[0][k].type,
    //       notNull: reArr[0][k].notNull,
    //       unique: reArr[0][k].unique,
    //     };
    //   }

    //   reNew.push(reN);
    // }
    // console.log("here =" + reArr[0][1].value);
    // reArr.push(reNew);
    // this.setState({storeData: reArr});
    let irow = this.state.irow;
    irow++;
    this.setState({irow: irow});
  };
  addColHandler = newVal => {
    let reArr = this.state.storeData;
    for (let k = 0; k < this.state.irow; k++) {
      let reNew = {
        id: k + '',
        colName: this.state.newHeader,
        pk: String(this.state.newColumnAttr.pk),
        defaultValue: this.state.newColumnAttr.defaultValue,
        value: this.state.newColumnAttr.value,
        size: this.state.newColumnAttr.size,
        autoInc: '',
        type: this.state.newColumnAttr.type,
        notNull: '',
        unique: '',
      };
      reArr[k].push(reNew);
    }
    this.setState({storeData: reArr});
    let icol = this.state.icol;
    icol++;
    this.setState({icol: icol});

    let pkDecide = [],
      k = 0;
    console.log(this.state.header1);
    for (let j = 0; j < this.state.icol; j++) {
      if (this.state.header1[j].pk === '1') {
        pkDecide[k] = this.state.header1[j].pk;
        console.log(pkDecide[k]);
        k++;
      }
    }

    let tableQuery = Queries.insertColumn(
      this.state.tableName,
      this.state.newHeader,
      this.state.header1,
      this.state.icol,
      pkDecide
    );
    this.QueryExecuteHandler(tableQuery, this.state.tableName);
  };
  onUpdateValueColumnAttr = evt => {
    let newColumnAttr = this.state.newColumnAttr;
    // let check = evt.target.checked;
    if (evt.target.name === 'pk') {
      console.log('hit ' + evt.target.checked + 'hit ' + evt.target.defaultChecked);

      if (evt.target.checked === true) {
        console.log(evt.target.checked + ' installed ');
        newColumnAttr.pk = '1';
      } else {
        console.log(evt.target.checked + ' else installed ');
        newColumnAttr.pk = '0';
      }
    }
    if (evt.target.id === 'length') {
      newColumnAttr.size = evt.target.value;
      console.log('length is here   ' + newColumnAttr.size);
    }
    if (evt.target.id === 'Default-Value') {
      newColumnAttr.defaultValue = evt.target.value;
      console.log('defaultValue is here   ' + newColumnAttr.defaultValue);
    }
    if (evt.target.id === 'Data-type') {
      newColumnAttr.type = evt.target.value;
      if (newColumnAttr.type !== 'STRING') {
        this.setState({lengthDisableStatus: 1});
      } else {
        this.setState({lengthDisableStatus: 0});
      }
      console.log('Data-type is here   ' + newColumnAttr.type);
    }
    if (evt.target.id === 'ColumnName') {
      console.log('ColumnName is here   ' + evt.target.value);
      let val = evt.target.value;
      this.setState({newVal: val});
      return;
    }
    this.setState({newColumnAttr: newColumnAttr});
  };
  resetForm() {
    let empty = {};
    let newColumnAttr = this.state.newColumnAttr;
    newColumnAttr.pk = '0';
    newColumnAttr.size = 0;
    newColumnAttr.colName = '';
    newColumnAttr.defaultValue = '';
    newColumnAttr.type = 'STRING';
    this.setState({newColumnAttr: empty});
    this.setState({newColumnAttr: newColumnAttr});
  }
  onUpdateHeader = evt => {
    let val = evt.target.value;
    this.setState({newHeader: val});
  };

  addSubmitHandler() {
    // let sub = JSON.stringify(this.state.storeData);
    console.log(JSON.stringify(this.state.storeData));
    // console.log(state)
  }
  crossBtnClickHandler = index => {
    // console.log(index);
    let setIndex = this.state.setIndex;
    setIndex = 0;
    this.setState({setIndex: setIndex});
    let flag = 0;
    this.setState({flag: flag});
    // let l = 0;
    // let dupStoreData = [];
    // let array2 = this.state.storeData;

    // let dupHeader = [];
    // let header = this.state.header;
    // for (let k = 0; k < header.length; k++) {
    //   if (k !== index) {
    //     dupHeader[l] = header[k];
    //     l++;
    //   }
    // }
    // for (let i = 0; i < this.state.irow; i++) {
    //   dupStoreData[i] = [];
    //   for (let j = 0; j < this.state.icol; j++) {
    //     if (j !== index) {
    //       dupStoreData[i].push(array2[i][j]);
    //     }
    //   }
    // }
    let icol = this.state.icol;
    icol--;
    this.setState({icol: icol});
    // console.log(Queries.deleteColumn('tableName', this.state.header[index], this.state));
    let dltQuery = Queries.deleteColumn(this.state.tableName, this.state.header[index], this.state);
    this.QueryExecuteHandler(dltQuery, this.state.tableName);

    // this.setState({header: dupHeader});
    // this.setState({storeData: dupStoreData});
    // console.log(dupStoreData);

    // console.log(array);
  };
  myfunc(evt) {
    let newColumnAttr = {
      id: '',
      defaultValue: '',
      autoInc: '',
      type: 'STRING',
      notNull: '',
      unique: '',
      size: 0,
      pk: '0',
    };
    if (this.state.header1[evt] !== undefined) {
      newColumnAttr.colName = this.state.header1[evt].colName;
      newColumnAttr.size = this.state.header1[evt].size;
      newColumnAttr.defaultValue = this.state.header1[evt].defaultValue;
    }
    this.setState({newColumnAttr: newColumnAttr});
    this.setState({setIndex: evt});
    // this.state.newColumnAttr.pk = this.state.header1[evt].pk;
    // this.state.newColumnAttr.value = this.state.header1[evt].value;
    this.setState({newHeader: this.state.header[evt]});
    // this.setState({setIndex: 0});
  }

  crossEditBtnInHeader(header, index) {
    if (index > 0 && index < this.state.header.length - 1) {
      return (
        <div>
          <button
            type="button"
            onClick={() => this.crossBtnClickHandler(index)}
            id={index}
            key={index}
            className="close crossBtn"
          >
            <i className="fa fa-close " />
          </button>
          <button
            type="button"
            id="btn"
            key={index + 100}
            name={index}
            className="close crossBtn editBtn"
            onClick={() => this.myfunc(index)}
            data-toggle="modal"
            data-target="#modifyColumnModal"
          >
            <i className="fa fa-edit " />
          </button>
        </div>
      );
    }
  }
  // makeInputFieldEditable(evt) {}

  fetchDataInStoreData(response) {
    let header = [],
      storeData = [[]],
      mainArr = [],
      i = 0;
    let j = 0;
    let colDetails = {};
    let header3 = [];
    let colObject;
    let arr;
    // this.setState({header: []});
    console.log('step1');
    let headerArr = [];
    let header2 = [...this.state.header1]; // new header added with properties
    for (j = 0; j < response.column.length; j++) {
      header[j] = response.column[j].name;
    }

    header[j] = 'Action';
    this.setState({header: header});

    if (response.data.isEmpty === false) {
      alert('yes');
      console.log(response.data);
      console.log('here respine ');
      arr = response.data[0];
      colObject = Object.entries(arr);
    }
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
      if (response.data.isEmpty === false) {
        headerArr.defaultValue = colObject[i][1];
      }

      headerArr.id = String(i);
      headerArr.colName = response.column[i].name;
      headerArr.size = response.column[i].length;
      // console.log('col name is   ' + response.column[i].name);
      header3.push(headerArr);

      headerArr = [];
    }

    let action = {colName: 'action', pk: '0', size: 0};
    this.setState({header1: header3});
    this.state.header1.push(action);
    header2.push(action);
    console.log(this.state.header1);

    if (response.data[0] === undefined || response.data[0] === null) {
      // yaha alert lga sakte hai k table empty hai
      this.setState({storeData: []});
      this.setState({irow: 0});
      return;
    }

    // let defaultValue = colObject[0][1];
    // console.log(response);
    for (let k = 0; k < response.data.length; k++) {
      storeData = [];
      let arr = response.data[k];
      colObject = Object.entries(arr);
      for (let j = 0; j < colObject.length; j++) {
        let defaultValue = colObject[j][1];
        // console.log('default value: ' + defaultValue);
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
  QueryExecuteHandler(tableQuery, tableName) {
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
        this.fetchDataInStoreData(response); // this funtion to print fetch data in table
      })
      .catch(function(res) {
        console.log(res);
      });
    console.log('request sent');
  }

  fetchHandler(selectedTable) {
    this.setState({tableName: selectedTable});
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
        // console.log('here respoe');
        // console.log(response);
        this.fetchDataInStoreData(response); // this funtion to print fetch data in table
      })
      .catch(function(res) {
        // console.log(res);
      });
    console.log('request sent');
  }
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

    // *******************************{End Header working} ********************
  }

  comboBoxValueHandler = evt => {
    console.log('in modify table' + evt.target.value);

    let selectedTable = evt.target.value;
    let storeData = [];
    let header = [];
    this.setState({offModalpopup: 'off'});
    this.setState({storeData: storeData});
    this.setState({header: header});
    this.fetchHandler(selectedTable);
    this.setState({offModalpopup: 'on'});
  };
  dropTableHandler() {
    let dltQuery = Queries.dropTable(this.state.tableName);
    this.QueryExecuteHandler(dltQuery, this.state.tableName);
    window.location.reload();
  }

  render() {
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
                    <h3>
                      Modify Table
                      <ComboBox
                        comboBoxValueHandler={this.comboBoxValueHandler.bind(this)}
                        fetchHandler={this.fetchHandler.bind(this)}
                      />
                      <button
                        onClick={this.dropTableHandler.bind(this)}
                        className="btn btn-primary zoomBtn"
                        style={{padding: '10px'}}
                      >
                        Drop Table
                      </button>
                    </h3>
                  </div>
                  {/* <p className="panel-subtitle">Period: Oct 14, 2016 - Oct 21, 2016</p> */}
                </div>
                <div className="panel-body">
                  <button
                    type="button"
                    className="btn btn-primary zoomBtn"
                    onClick={this.resetForm.bind(this)}
                    data-toggle="modal"
                    data-target="#exampleModal"
                  >
                    Add Column
                  </button>
                  <button
                    id="addBtn"
                    className="btn btn-primary addBtn zoomBtn"
                    onClick={() => this.addRowHandler(this.state.row)}
                  >
                    Add Row
                  </button>
                  {/* <ComboBox /> */}
                  {this.state.offModalpopup === 'on' ? (
                    <ModalPopup
                      headerWthProps={this.state.header1}
                      resetForm={this.resetForm.bind(this)}
                      modifyColumnHandler={this.modifyColumnHandler.bind(this)}
                      setIndex={this.state.setIndex}
                      storeData={this.state.storeData}
                      newColumnAttr={this.state.newColumnAttr}
                      num={this.state.num}
                      flag={this.state.flag}
                      icol={this.state.icol}
                      header={this.state.header}
                      newHeader={this.state.newHeader}
                      onUpdateHeader={this.onUpdateHeader.bind(this)}
                      newValue={this.state.newVal}
                      onUpdateValueColumnAttr={this.onUpdateValueColumnAttr.bind(this)}
                      addHeaderHandler={this.addHeaderHandler.bind(this)}
                      lengthDisableStatus={this.state.lengthDisableStatus}
                      // addColHandler={this.addColHandler}
                    />
                  ) : (
                    ''
                  )}

                  {/* {this.state.flag === 1 ? <ModalPopup /> : ''} */}
                  {/* table body */}

                  <table id="tableId">
                    <tbody>
                      {/*%%%%%%%%%%%%%%%%%%%% header DOM working %%%%%%%%%%%%%%*/}
                      <tr className="header">
                        {this.state.header.map((header, index) => (
                          <th key={index}>
                            {/* {this.setState({ setIndex: index })} */}
                            {this.crossEditBtnInHeader(header, index)}
                            {this.inputField(index, header)}
                            {/* {this.setIndexHandler(index)} */}
                          </th>
                        ))}
                      </tr>
                      {/*%%%%%%%%%%%%%%%%%%%% End header DOM working %%%%%%%%%%%%%%*/}

                      {/*%%%%%%%%%%%%%%%%%%%% Table Rows/columns DOM working %%%%%%%%%%%%%%*/}

                      {this.state.storeData.map((yo, index) => (
                        <Rows
                          show={this.state.show}
                          key={String(index)}
                          addDltEdtBtn={this.addDltEdtBtn.bind(this)}
                          onDelete={this.handleRowDelete.bind(this)}
                          index={index}
                          id={String(index)}
                          inputisEditableIndex={this.state.inputisEditableIndex}
                          storeData={this.state.storeData}
                          handleValueChange={this.handleValueChange.bind(this)}
                          inputisEditableFlag={this.state.inputisEditableFlag}
                        />
                      ))}
                    </tbody>
                  </table>

                  {/* <button onClick={this.print.bind(this)}>print</button> */}
                  {/* <button
                    id="addBtn"
                    onClick={() => this.addColHandler(this.state.columns)}
                  >
                    ADDColumns
                  </button> */}
                  <button
                    className="btn btn-primary subBtn zoomBtn"
                    id="subBtn"
                    onClick={this.addSubmitHandler.bind(this)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- END MAIN CONTENT --> */}
        </div>
        {/*%%%%%%%%%%%%%%%%%%%% END Table Rows/columns DOM woring %%%%%%%%%%%%%%*/}
      </React.Fragment>
    );
  }
}

export default ModifyTable;
