import React, {Component} from 'react';
import ReactDOM from 'react-dom';
class Rows extends Component {
  state = {};
  // addColHandler = col => {
  //   const ColData = [...this.state.columns];
  //   let newCol = [{ id: 5, value: 3 }];
  //   ColData.push(newCol);
  //   this.setState({ columns: ColData });
  // };

  inputField(index) {
    if (
      this.props.inputisEditableFlag === 'false' &&
      parseInt(this.props.index) === parseInt(this.props.inputisEditableIndex) &&
      index !== 0
    ) {
      return (
        <input
          maxLength={
            this.props.storeData[0][index].type === 'STRING'
              ? String(this.props.storeData[this.props.index][index].size)
              : ''
          }
          type={this.props.storeData[0][index].type !== 'STRING' ? 'number' : 'text'}
          // placeholder={this.props.storeData[0][index].value}
          // value={index === 0 ? this.props.index : ""}
          defaultValue={
            index === 0
              ? this.props.storeData[this.props.index][index].value
              : this.props.storeData[this.props.index][index].defaultValue
          }
          onClick={this.props.defaultEditable}
          className="cellInput"
          name={this.props.index}
          // value={row.value}
          onChange={this.props.handleValueChange}
          key={String(this.props.index) + String(index)}
          id={index}
        />
      );
    } else {
      return (
        <input
          readOnly
          maxLength={
            this.props.storeData[0][index].type === 'STRING'
              ? String(this.props.storeData[this.props.index][index].size)
              : ''
          }
          defaultValue={
            index === 0
              ? this.props.storeData[this.props.index][index].value
              : this.props.storeData[this.props.index][index].defaultValue
          }
          // type={this.props.storeData[0][index].type}
          // placeholder={
          //   index === 0
          //     ? this.props.index
          //     : this.props.storeData[0][index].value
          // }
          // value={index === 0 ? this.props.index : ""}
          className="cellInput"
          name={this.props.index}
          // value={index === 0 ? this.props.index : ""}
          onChange={this.props.handleValueChange}
          key={String(this.props.index) + String(index)}
          id={index}
        />
      );
    }
  }
  render() {
    return (
      <React.Fragment>
        {this.props.show === 'yes' ? ( // run this when create table called
          <tr key={this.props.id}>
            {this.props.storeData[this.props.index].map((row, index) => {
              return <td key={String(this.props.index) + String(index)}>{this.inputField(index)}</td>;
            })}

            <td>
              <button
                id={this.props.index}
                onClick={this.props.onDelete}
                className="btn btn-danger zoomBtn"
                style={{margin: 5}}
              >
                Delete
              </button>
              {this.props.addDltEdtBtn(this.props.index)}
            </td>

            <script />
          </tr>
        ) : (
          // run this when view table called
          <tr key={this.props.id}>
            {this.props.storeData[this.props.index].map((row, index) => {
              return <td key={String(this.props.index) + String(index)}>{this.inputField(index)}</td>;
            })}
          </tr>
        )}
      </React.Fragment>
    );
  }
}

export default Rows;
