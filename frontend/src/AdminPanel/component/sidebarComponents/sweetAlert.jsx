import React, {Component} from 'react';
class SweetAlert extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div
          className="modal fade"
          id="sweetAlert,"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="sweetAlertLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                {console.log('sweeeetttttttt')}
                <h5 className="modal-title" id="sweetAlertLabel">
                  Add New Column
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SweetAlert;
