import React, {Component} from 'react';

class ModalPopup extends Component {
  state = {
    status: 1,
    dv: '',
    checking: 0,
  };

  call() {
    return this.props.addNewColumnsHandler;
  }

  checked() {
    let t = this.props.headerWthProps[this.props.setIndex].pk;
    console.log('t is here' + typeof t);
    if (t === '1') {
      return (
        <div>
          <input
            className="cellInput"
            id="pk"
            name="pk"
            style={{marginLeft: '5px'}}
            type="checkbox"
            defaultChecked={1}
            onChange={this.props.onUpdateValueColumnAttr}
          />
        </div>
      );
    } else {
      console.log(t + ' here t');
      return (
        <div>
          <div>
            <input
              className="cellInput"
              id="pk"
              name="pk"
              style={{marginLeft: '5px'}}
              type="checkbox"
              defaultChecked={0}
              onChange={this.props.onUpdateValueColumnAttr}
            />
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add New Column
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <form onSubmit={this.props.addHeaderHandler} method="post">
                <div className="modal-body">
                  {/* %%%%%%%%%%%%%%%%  column name  %%%%%%%%%%%%%%%% */}
                  <label style={{color: 'white'}}>Enter Column Name</label>
                  <input
                    style={{marginLeft: '2%'}}
                    className="cellInput"
                    placeholder="Column Name"
                    id="ColumnName"
                    // name={this.props.newHeader}
                    onChange={this.props.onUpdateHeader}
                    required
                  />
                  <br />
                  {/* %%%%%%%%%%%%%%%%  Default Value %%%%%%%%%%%%%%%% */}

                  <label style={{color: 'white'}}>Enter Default-Value</label>
                  <input
                    type="text"
                    style={{marginLeft: '3%'}}
                    className="cellInput"
                    placeholder="Optional.."
                    id="Default-Value"
                    onChange={this.props.onUpdateValueColumnAttr}
                  />

                  <br />
                  {/* %%%%%%%%%%%%%%%%  data type  %%%%%%%%%%%%%%%% */}
                  <label style={{color: 'white'}}>Enter Data-type</label>
                  <select
                    style={{marginLeft: '7.5%'}}
                    className="cellInput"
                    id="Data-type"
                    defaultValue="STRING"
                    onChange={this.props.onUpdateValueColumnAttr}
                  >
                    <option key="1" value="STRING">
                      STRING
                    </option>
                    <option key="2" value="number">
                      NUMBER
                    </option>
                    <option key="3" value="FLOAT">
                      FLOAT
                    </option>
                    <option key="4" value="DOUBLE">
                      DOUBLE
                    </option>
                  </select>
                  <br />
                  {/* %%%%%%%%%%%%%%%%  length  %%%%%%%%%%%%%%%% */}
                  <label style={{color: 'white'}}>Enter length</label>
                  <input
                    style={{marginLeft: '12%'}}
                    className="cellInput"
                    id="length"
                    type="number"
                    min="0"
                    value={this.value}
                    placeholder="length"
                    onChange={this.props.onUpdateValueColumnAttr}
                    required
                    disabled={this.props.lengthDisableStatus}
                  />
                  <br />
                  {/* %%%%%%%%%%%%%%%%  pk  %%%%%%%%%%%%%%%% */}
                  <label style={{color: 'white'}}>Primary Key</label>
                  <input
                    className="cellInput"
                    name="pk"
                    id={this.props.num}
                    style={{marginLeft: '5px'}}
                    type="checkbox"
                    checked={parseInt(this.props.newColumnAttr.pk)}
                    // defaultChecked={!this.props.newColumnAttr.pk === '' ? parseInt(this.props.newColumnAttr.pk) : 0}
                    onChange={this.props.onUpdateValueColumnAttr}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="reset"
                    className="btn btn-danger zoomBtn"
                    style={{marginRight: '42%'}}
                    onClick={this.props.resetForm}
                    // data-dismiss="modal"
                  >
                    Reset
                  </button>
                  <button
                    style={{marginRight: '8px'}}
                    type="button"
                    className="btn btn-default zoomBtn"
                    data-dismiss="modal"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary zoomBtn"
                    // onClick={this.props.addNewColumnsHandler}
                    // data-dismiss="modal"
                  >
                    Savechanges
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  modify column  %%%%%%%%%%%%%%%%%%%%%%%%%%%% */}

        <div
          className="modal fade"
          id="modifyColumnModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modifyColumnModal"
          aria-hidden="true"
        >
          {/* {console.log("nafix set ")} */}
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modifyColumnModal">
                  Modify Column
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form onSubmit={this.props.modifyColumnHandler}>
                <div className="modal-body">
                  {/* %%%%%%%%%%%%%%%%  column name  %%%%%%%%%%%%%%%% */}
                  <label style={{color: 'white'}}>Enter Column Name</label>
                  <input
                    style={{marginLeft: '2%'}}
                    className="cellInput"
                    defaultValue={this.props.newColumnAttr.colName}
                    id="ColumnNameModify"
                    onChange={this.props.onUpdateHeader}
                    required
                  />

                  <br />
                  {/* %%%%%%%%%%%%%%%%  Default Value %%%%%%%%%%%%%%%% */}
                  <label style={{color: 'white'}}>Enter Default-Value</label>
                  <input
                    type="text"
                    defaultValue={this.props.newColumnAttr.defaultValue}
                    style={{marginLeft: '3%'}}
                    className="cellInput"
                    id="Default-Value"
                    onChange={this.props.onUpdateValueColumnAttr}
                  />
                  <br />
                  {/* %%%%%%%%%%%%%%%%  data type  %%%%%%%%%%%%%%%% */}
                  {console.log('collen ' + this.props.newColumnAttr.defaultValue)}

                  <label style={{color: 'white'}}>Enter Data-type</label>
                  <select
                    style={{marginLeft: '7.5%'}}
                    className="cellInput"
                    id="Data-type"
                    defaultValue={
                      ''
                      // this.props.storeData[0][this.props.setIndex].type
                    }
                    onChange={this.props.onUpdateValueColumnAttr}
                  >
                    <option key="1" value="STRING">
                      STRING
                    </option>
                    <option key="2" value="number">
                      NUMBER
                    </option>
                    <option key="3" value="FLOAT">
                      FLOAT
                    </option>
                    <option key="4" value="DOUBLE">
                      DOUBLE
                    </option>
                  </select>
                  <br />
                  {/* %%%%%%%%%%%%%%%%  length  %%%%%%%%%%%%%%%% */}

                  <label style={{color: 'white'}}>Enter length</label>

                  <input
                    style={{marginLeft: '12%'}}
                    className="cellInput"
                    id="length"
                    type="number"
                    min="0"
                    value={this.props.newColumnAttr.size}
                    onChange={this.props.onUpdateValueColumnAttr}
                    required
                    disabled={this.props.lengthDisableStatus}
                  />
                  <br />
                  {/* %%%%%%%%%%%%%%%%  pk  %%%%%%%%%%%%%%%% */}

                  <label style={{color: 'white'}}>Primary Key</label>
                  {/* {this.checked()} */}
                </div>
                <div className="modal-footer">
                  <button type="reset" className="btn btn-danger zoomBtn" style={{marginRight: '42%'}} id="resetBtn">
                    Restore
                  </button>
                  <button
                    style={{marginRight: '8px'}}
                    type="button"
                    onClick={this.props.resetForm}
                    className="btn btn-default zoomBtn"
                    data-dismiss="modal"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary zoomBtn"
                    // onClick={this.props.addNewColumnsHandler}
                    // data-dismiss="modal"
                  >
                    Savechanges
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ModalPopup;
