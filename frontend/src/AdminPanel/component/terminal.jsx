import React, {Component} from 'react';
import NavBar from './navBar.jsx';
import SideMenu from './sideMenu.jsx';
import ViewTable from './sidebarComponents/viewTable.jsx';

class Terminal extends Component {
  // state = {
  //   messages: ["helllo,hiii"],
  //   fname: "Salman@root#",
  //   prompt: true
  // };

  state = {
    showTerminalTable: 'no',
    width: 700,
    tableData: [],
    data: [],
    inputWidth: 2,
    connnection: false,
    fname: 'zybase@root#',
    prompt: true,
    queries: [],
    qc: 0,
    cqc: 0,
    tableFlag: false,
    table: [[]],
  };

  // componentWillMount(){
  //   let data = this.state.data;
  //   data.push({type:false,text:"connecting to server..."})
  //   fetch("http://localhost:5000/terminal", {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //        "Content-Type": "application/json"
  //     },
  //     })
  //       .then(res => {
  //         console.log(res);
  //         return res.text();
  //       })
  //       .then(res => {
  //         console.log(res);
  //         if(res==="connected");
  //         this.setState({data:[]});
  //         this.setState({prompt:true});
  //       });
  // }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({behavior: 'smooth'});
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }
  keyPress(e) {
    this.setState({width: this.state.inputWidth});
    this.setState({inputWidth: this.state.inputWidth + 1});
    if (e.key === 'Enter') {
      this.setState({cqc: 0});
      let queries = this.state.queries;
      console.error(queries);
      queries.push(e.target.value);
      this.setState({queries: queries});
      this.setState({qc: this.state.qc + 1});
      this.setState({width: 60});
      this.setState({inputWidth: 60});
      console.log('enter preesed');
      let request = this.state.data;
      request.push({type: true, text: e.target.value});
      //request.push(e.target.value);
      this.setState({data: request});
      //this.setState({ requestCount: this.state.requestCount + 1 });
      this.setState({prompt: false});
      console.error('errrrrrrrrrrrrrrrrrrrrrror');
      this.setState({showTerminalTable: 'no'});

      fetch('http://localhost:5000/terminal', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: e.target.value,
        }),
      })
        .then(res => {
          //console.log(res);
          return res.json();
        })
        .then(res => {
          console.log(res);

          let response = this.state.data;
          if (res.error == true) {
            if (res.data.sqlMessage.includes('Access denied')) {
              res.data.sqlMessage = 'You are not allowed to perform this operation';
            }
            res = JSON.stringify(res.data.sqlMessage);
            response.push({type: false, text: res, error: true});
          } else {
            if (res.table == true) {
              this.setState({tableData: res});
              let data = this.state.data;
              data.push({type: false, text: 'print table', error: false});
              this.setState({data: data});
              document.getElementById('prompt-input').value = '';
              this.setState({prompt: true});
              this.setState({tableFlag: true});
              this.setState({showTerminalTable: 'yes'});

              return;
            }
            res = JSON.stringify(res);
            response.push({type: false, text: res, error: false});
            this.setState({data: response});
          }
          //this.setState({ responseCount: this.state.responseCount + 1 });
          this.setState({prompt: true});
        })
        .catch(error => {
          let data = this.state.data;
          data.push({type: false, text: 'Request timeout.', error: true});
          this.setState({data: data});
          this.setState({prompt: true});
        });
      //console.log(e);
      document.getElementById('prompt-input').value = '';
      // e.preventDefault();
      // e.target.reset();
    }
  }
  onBlur(e) {
    // this.setState({ inputWidth: 640 });
  }
  onFocus(e) {
    // this.setState({ inputWidth: this.state.width });
  }
  onKeyDown(e) {
    if (e.keyCode === 8) {
      this.setState({inputWidth: this.state.inputWidth - 1});
    }

    if (e.keyCode === 38) {
      // console.log(
      //   "uppperrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr"
      // );
      // if (this.state.qc === -1) {
      //   document.getElementById("prompt-input").value = "";
      //   return;
      // // }
      // if (this.state.qc == this.state.cqc - 2) {
      //   return;
      // }

      console.error(this.state.cqc + '   ' + this.state.qc);
      // if (this.state.qc == this.state.cqc - 2) {
      //   document.getElementById("prompt-input").value = "";
      //   return;
      // }
      if (this.state.queries[this.state.qc - (this.state.cqc + 1)] != undefined) {
        document.getElementById('prompt-input').value = this.state.queries[this.state.qc - (this.state.cqc + 1)];
        this.setState({cqc: this.state.cqc + 1});
      }

      console.error(this.state.queries);
    }

    if (e.keyCode == 40) {
      console.error(this.state.cqc + '   ' + this.state.qc);
      console.error(this.state.queries);

      if (this.state.queries[this.state.qc - (this.state.cqc - 1)] != undefined) {
        console.error(this.state.cqc + '  b  ' + this.state.qc);
        document.getElementById('prompt-input').value = this.state.queries[this.state.qc - (this.state.cqc - 1)];
        this.setState({cqc: this.state.cqc - 1});
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="wrapper">
          {/* <!-- NAVBAR --> */}
          <NavBar />
          {/* end of navBar */}
          {/* <!-- LEFT SIDEBAR --> */}
          <SideMenu callingComponent="Terminal" />
          {/* <!-- END LEFT SIDEBAR --> */}
          {/* <!-- MAIN --> */}

          {/* <CreateTable /> */}
          <div className="main">
            <div className="terminal">
              <div className="messages">
                {this.state.data.map(message => (
                  <span>
                    {message.type ? <p className="input-prompt  p-inline ea">{this.state.fname}</p> : null}
                    &nbsp;
                    {message.type ? (
                      <p className="p-inline text" input-prompt>
                        {message.text}
                      </p>
                    ) : null}
                    {/* {message.tyepe?<br />:null} */}
                    {!message.type ? <p className={message.error ? 'error' : 'success'}>{message.text}</p> : null}
                    {!message.type ? <br /> : null}
                  </span>
                ))}
              </div>
              <div className="prompt" style={{display: this.state.prompt ? 'inline' : 'none'}}>
                <p className="input-prompt">{this.state.fname}</p>
                <input
                  autoFocus
                  onKeyDown={this.onKeyDown.bind(this)}
                  onBlur={this.onBlur.bind(this)}
                  onFocus={this.onFocus.bind(this)}
                  style={{
                    width: this.state.inputWidth + '%',
                    minWidth: '70%',
                  }}
                  id="prompt-input"
                  type="text"
                  className="input-prompt"
                  onKeyPress={this.keyPress.bind(this)}
                />
              </div>
              <div
                style={{float: 'left', clear: 'both'}}
                ref={el => {
                  this.messagesEnd = el;
                }}
              />
            </div>
            <div style={{marginTop:"300px",marginLeft:"100px"}}>
            {this.state.tableFlag === true && this.state.showTerminalTable === 'yes' ? (
              <ViewTable tableData={this.state.tableData} showTerminalTable={this.state.showTerminalTable} />
            ) : (
              ''
            )}
          </div>
          </div>
          {/* table print here */}
          
          {/* table end here */}
          {/* <!-- END MAIN --> */}

          <div className="clearfix" />
          <footer>
            <div className="container-fluid" />
          </footer>
        </div>
        {/* <!-- END WRAPPER --> */}
        {/* <!-- Javascript --> */}
      </React.Fragment>
    );
  }
}

export default Terminal;
