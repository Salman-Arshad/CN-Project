import React, {Component} from 'react';
var DoughnutChart = require('react-chartjs').Doughnut;

class Main extends Component {
  state = {
    currentUsersCount: [
      {
        value: 300,
        color: 'rgba(177, 226, 64, 0.4)',
        highlight: '#FF5A5E',
        label: 'Red',
      },
      {
        value: 50,
        color: '#0E8174',
        highlight: '#5AD3D1',
        label: 'Green',
      },
    ],
    queriesPerHour: [
      {
        value: 300,

        color: 'rgba(177, 226, 64, 0.4)',
        highlight: '#FF5A5E',
        label: 'Red',
      },
      {
        value: 50,
        color: '#0E8174',
        highlight: '#5AD3D1',
        label: 'Green',
      },
    ],
  };
  queries = 44;

  options = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke: false,

    //String - The colour of each segment stroke
    segmentStrokeColor: '#fff',

    //Number - The width of each segment stroke
    segmentStrokeWidth: 1,

    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 0, // This is 0 for Pie charts

    //Number - Amount of animation steps
    animationSteps: 100,

    //String - Animation easing effect
    animationEasing: 'easeOutBounce',

    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate: true,

    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale: false,
    //String - A legend template
    legendTemplate:
      '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>',
  };
  componentDidMount() {
    fetch('http://localhost:5000/analytics', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(function(res) {
        return res.json();
      })
      .then(response => {
        this.setState({apikey:response.api_key});
        this.setState({productkey:response.product_id});
        this.setState({tableCount: response.tableCount});
        this.setState({userCount: response.userCount});

        let currentUsersCount = this.state.currentUsersCount;
        currentUsersCount[0].value = response.currentUserCount;
        currentUsersCount[1].value = 60 - response.currentUserCount;
        this.setState({currentUsersCount: currentUsersCount});

        let queriesPerHour = this.state.queriesPerHour;
        queriesPerHour[0].value = response.QueriesPerHour;
        queriesPerHour[1].value = 200 - response.QueriesPerHour;
        this.setState({queriesPerHour: queriesPerHour});
      })
      .catch(function(res) {
        console.log(res);
      });
    console.log('request sent');
  }

  render() {
    return (
      <React.Fragment>
        <div className="main">
          {/* <!-- MAIN CONTENT --> */}
          <div className="main-content">
            <div className="container-fluid">
              {/* custom kaam */}
              <div className="row">
              <div className="col-md-6">
              <div className="panel panel-headline login-form">
                    <div className="panel-heading">
                      <h3 className="panel-title" style={{ marginLeft: "31%" }}>Product  Key
                      </h3><hr className="style-four"/>
                      <h4 col-md-offset-2 style={{marginLeft:"25%"}}>{this.state.productkey}</h4>
                      </div></div></div>


                      <div className="col-md-6">
              <div className="panel panel-headline login-form">
                    <div className="panel-heading">
                      <h3 className="panel-title" style={{ marginLeft: "40%" }}>API Key
                      </h3><hr className="style-four"/>
                      <h4 col-md-offset-2 style={{marginLeft:"32%"}}>{this.state.apikey}</h4></div></div></div>
                      
                <div className="col-md-4">
                  <div className="panel panel-headline">
                    <div className="panel-heading">
                      <h3 className="panel-title" style={{marginLeft: '10%'}}>
                        Total Number of Tables
                      </h3>
                      <hr className="style-four" />
                      <p className="dabba">{this.state.tableCount}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="panel panel-headline">
                    <div className="panel-heading">
                      <h3 className="panel-title" style={{marginLeft: '10%'}}>
                        Total Number of Users
                      </h3>
                      <hr className="style-four" />
                      <p className="dabba">{this.state.userCount}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="panel panel-headline">
                    <div className="panel-heading">
                      <h3 className="panel-title" style={{marginLeft: '10%'}}>
                        Total Number Of Queries
                      </h3>
                      <hr className="style-four" />
                      <p className="dabba">40</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="panel panel-headline">
                    <div className="panel-heading mb">
                      <h3 className="panel-title" style={{marginLeft: '35%'}}>
                        Currently Connected Users / 60
                      </h3>
                      <hr className="style-four" />
                    </div>
                    <div className="panel-body">
                      <div className="dough">
                        <DoughnutChart data={this.state.currentUsersCount} options={this.options} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="panel panel-headline">
                    <div className="panel-heading mb">
                      <h3 className="panel-title" style={{marginLeft: '25%'}}>
                        Queries Per Hour / 100
                      </h3>
                      <hr className="style-four" />
                    </div>
                    <div className="panel-body">
                      <div className="dough">
                        <DoughnutChart data={this.state.queriesPerHour} options={this.options} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* custom kaam khatm */}
              {/* <!-- OVERVIEW --> */}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Main;
