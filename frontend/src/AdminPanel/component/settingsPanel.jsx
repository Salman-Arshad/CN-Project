import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import NavBar from './navBar';
import SideMenu from './sideMenu.jsx';
class SettingPanel extends Component {
  state = {
    fullname: ' ',
    email: ' ',
    opass: '',
    npass: '',
    rnpass: '',
    flag: true,
    error: false,
    eMessage: '',
  };
  componentDidMount() {
    fetch('http://localhost:5000/settings', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        this.setState({fullname: res.fullname});
        this.setState({email: res.email});
      });
  }
  fullnameChangeHandler = e => {
    this.setState({fullname: e.target.value});
    this.setState({flag: false});
    console.log(this.state.fullname);
  };
  opassChangeHandler = e => {
    this.setState({opass: e.target.value});
    this.setState({flag: false});
    console.log(this.state.opass);
  };
  npassChangeHandler = e => {
    this.setState({npass: e.target.value});
    this.setState({flag: false});
    console.log(this.state.npass);
  };

  rnpassChangeHandler = e => {
    this.setState({rnpass: e.target.value});
    this.setState({flag: false});
    console.log(this.state.rnpass);
  };
  handleSubmit = e => {
    this.setState({eMessage: ''});
    console.log(this.state);
    console.log('submit');
    let fullname = this.state.fullname;
    let email = this.state.email;
    let opass = this.state.opass;
    let npass = this.state.npass;
    let rnpass = this.state.rnpass;

    if (opass == '' && npass == '' && rnpass == '') {
      alert('hello');
      fetch('http://localhost:5000/settings', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: fullname,
          pChange: false,
        }),
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          if (res.error == true) {
            this.setState({eMessage: res.eMessage});
            this.setState({error: true});
          } else {
            this.setState({eMessage: res.eMessage});
            this.setState({error: false});
          }
        });
    } else {
      if (npass == rnpass) {
        fetch('http://localhost:5000/settings', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullname: fullname,
            opass: opass,
            npass: npass,
            rnpass: rnpass,
            pChange: true,
          }),
        })
          .then(res => {
            return res.json();
          })
          .then(res => {
            if (res.error == true) {
              this.setState({eMessage: JSON.stringify(res.eMessage)});
              this.setState({error: true});
            } else {
              this.setState({eMessage: res.eMessage});
              this.setState({error: false});
            }
          })
          .catch(e => {
            this.setState({
              eMessage: 'Some problem occured check your network COnnection ',
            });
            this.setState({error: false});
          });
      } else {
        this.setState({error: true, eMessage: 'Passwords do not match'});
      }
    }
  };
  myfunc() {
    console.log(this.state.error);
    if (this.state.eMessage != '') {
      if (this.state.error) {
        return <div className="alert alert-danger">{this.state.eMessage}</div>;
      } else {
        return <div className="alert alert-success">{this.state.eMessage}</div>;
      }
    }
  }
  render() {
    return (
      <React.Fragment>
        {/* <CreateTable /> */}
        <div className="main">
          <div className="main-content">
            <div className="container-fluid">
              <div className="row" />
              <div className="col-md-6 col-md-offset-2 " style={{paddingLeft: '5%'}}>
                <div className="panel panel-headline login-form">
                  <div className="panel-heading">
                    <h3 className="panel-title " style={{marginLeft: '31%'}}>
                      <span className="lnr lnr-user" style={{position: 'relative', right: '30px'}} />
                      User Profile
                    </h3>
                    <hr className="style-four" />
                  </div>
                  <div>{this.myfunc()}</div>

                  <form className="col-md-offset-2" onSubmit={this.handleSubmit}>
                    <label style={{color: 'white', display: 'block'}}>Full Name</label>
                    <input
                      type="text"
                      className="cellInput up"
                      autoFocus
                      name="fulname"
                      value={this.state.fullname}
                      onChange={this.fullnameChangeHandler}
                    />
                    <br />
                    <label style={{color: 'white', display: 'block'}}>Email:</label>
                    <input
                      type="text"
                      className="cellInput up"
                      autoFocus
                      name="email"
                      style={{color: 'rgb(199, 199, 199)'}}
                      value={this.state.email}
                      readOnly
                    />
                    <br />
                    <label style={{color: 'white', display: 'block'}}>Old Password</label>
                    <input
                      type="text"
                      className="cellInput up"
                      autoFocus
                      name="opass"
                      onChange={this.opassChangeHandler}
                    />
                    <br />
                    <label style={{color: 'white', display: 'block'}}>New Password</label>
                    <input
                      type="text"
                      className="cellInput up"
                      autoFocus
                      name="npass"
                      onChange={this.npassChangeHandler}
                    />
                    <br />
                    <label style={{color: 'white', display: 'block'}}> Re-enter New Password</label>
                    <input
                      type="text"
                      className="cellInput up"
                      autoFocus
                      name="rnpass"
                      onChange={this.rnpassChangeHandler}
                    />
                    <br />

                    <button
                      type="submit"
                      className="btn btn-primary zoomBtn"
                      disabled={this.state.flag}
                      // onClick={}
                      style={{
                        marginBottom: '5px',
                        marginTop: '10px',
                        marginLeft: '10px',
                      }}
                    >
                      Save
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- END MAIN --> */}
      </React.Fragment>
    );
  }
}
export default SettingPanel;
