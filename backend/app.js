const app = require('express')();
const bodyparse = require('body-parser');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const express = require('express');
var cookieParser = require('cookie-parser');
const expressSession = require('express-session');
var expressValidator = require('express-validator');
const randomStr = require('randomstring');
var mysql = require('mysql');
var userModel = require('./models/user');

var cors = require('cors');

//SOCEKT IO
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var sql = require('mysql');
var User = require('./models/user');
var global_socketio_users = [];

//SOCKET-IO SQL CONNECT
var SqlCon = sql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'zybase',
});
SqlCon.connect(function(err) {
  if (err) throw err;
  console.log(' Connected! sqlcon');
});

//FUNCTTIONN TO RESET NUMQUERIES IN global_socketio_users

function resetQueriesAutomatic() {
  //CAn save the queries to database in here to maintain the total num of queries ran
  global_socketio_users.forEach(element => {
    element.numQueries = 0;
  });
}
setInterval(resetQueriesAutomatic, 60 * 60 * 1000); //60 mins

//SOCKET-IO FUNCTIONING

require('socketio-auth')(io, {
  authenticate: function(socket, data, callback) {
    //get credentials sent by the client
    var product_id = data.product_id;
    var api_key = data.api_key;
    User.validateClient(SqlCon, product_id, api_key, (err, auth) => {
      if (err) throw err;
      else {
        if (auth === true) {
          return callback(null, 'Connected Sucessfully');
        } else {
          console.log('WRONG API/PRODUCT KEY');
          return callback(new Error('Wrong API KEY/PRdouct KEy combiantion Found'));
        }
      }
    });
  },
});

io.on('connection', function(client) {
  var mproduct_id = 'null';
  //client.emit("myevent", "waah hello world");
  console.log(client.rooms);
  client.on('JoinRoom', function(data) {
    // setTimeout(() => {
    //   client.emit('onNotificationReceived', 'waah hello world', 'asdasd');
    // }, 10000);
    //maybe enter this on authentication post function see socket.io auth git
    let found = false;
    global_socketio_users.forEach(element => {
      if (element.product_id == data.product_id) {
        element.count++;
        element.users.push(client.id);
        mproduct_id = data.product_id;
        found = true;
      }
    });
    if (!found) {
      global_socketio_users.push({
        product_id: data.product_id,
        count: 1,
        users: [client.id],
        numQueries: 0,
      });
    }
    console.log(global_socketio_users);
    client.join(data.product_id); //joining room

    var userSqlCon = sql.createConnection({
      host: 'localhost',
      user: data.product_id,
      port: 3306,
      password: data.api_key,
      database: data.product_id,
    });
    userSqlCon.connect(function(err) {
      if (err) throw err;
      console.log(' Connected2! sqlcon');
    });
    var srvSockets = io.sockets.sockets;
    console.log(Object.keys(srvSockets).length);

    client.on('queryExecuteRegister', function(dataObject, callback) {
      userSqlCon.query(dataObject.query, (err, res) => {
        if (err) callback('failed', err);
        callback('success', null);
      });
    });
    client.on('queryExecute', function(dataObject, callback) {
      //incrementing in queryExecute limit array
      let myproduct_id = dataObject.product_id;
      global_socketio_users.forEach(element => {
        if (element.product_id == myproduct_id) {
          element.numQueries++;
        }
      });

      //Processing query and corresponding changes in room
      let dataQuery = dataObject.query;
      console.log(dataQuery + 'RECEIVED');
      User.checkValidDataQuery(dataQuery, (err, valid) => {
        if (err || !valid) {
          callback([{message: 'No Result Due To Permission Issue In Query'}], err);
        } else {
          //NOW CHECK IF QUERY IS MODIFYING TABLE INSERT UPDATE DELETE SO THEN ECHO THE MODIFIED DATA INTHE ROOM
          //if query is update

          //str.search(/blue/i);
          //var Z = X.slice(X.indexOf("WHERE"));
          var tokenizer = dataQuery.split(' ');
          var deletedData = '';
          if (tokenizer[0].toLowerCase() == 'delete') {
            //getting delete data first because after execution data will be gone
            var miniquery = dataQuery.slice(dataQuery.search(/where/i)); //will get the query after(inclusive) where
            var dataToBeSentQuery = 'SELECT * FROM ' + tokenizer[2] + ' ' + miniquery;
            // console.log(dataToBeSentQuery);
            User.getDataToBeSent(userSqlCon, dataToBeSentQuery, (err, res) => {
              if (err) throw err;
              deletedData = res;
              userSqlCon.query(dataQuery, function(err, result, columns) {
                if (err) {
                  callback([{message: 'No Result Due To Error In Query'}], err);
                } else {
                  // console.log(result);
                  callback(result, 'None');
                  //response to that query is sent now sending responses to other room members
                  console.log(dataQuery);
                  //should use io.in if want to include sender else use socket.to('game').emit('nice game', "let's play a game");
                  if (result.affectedRows > 0) io.in(data.product_id).emit('onDataReceived', deletedData, 'Delete');
                }
              });
            });
          } else {
            userSqlCon.query(dataQuery, function(err, result, columns) {
              if (err) {
                callback([{message: 'No Result Due To Error In Query'}], err);
              } else {
                // console.log(result);
                callback(result, 'None'); //running the query above if select query then no need to update room
                //response to that query is sent now sending responses to other room members
                // console.log(dataQuery);

                if (tokenizer[0].toLowerCase() == 'insert') {
                  console.log('pakar lia insert      ');

                  if (tokenizer[2].includes('(')) {
                    tokenizer[2] = tokenizer[2].substring(0, tokenizer[2].indexOf('('));
                  }
                  var dataToBeSentQuery = `SELECT * FROM ${tokenizer[2]} where id=${result.insertId};`;
                  console.log(dataToBeSentQuery);
                  User.getDataToBeSent(userSqlCon, dataToBeSentQuery, (err, res) => {
                    //console.log(res);
                    console.log(data.product_id + '  ss');
                    //should use io.in if want to include sender else use socket.to('game').emit('nice game', "let's play a game");
                    io.in(data.product_id).emit('onDataReceived', res, 'Insert');
                  });
                } else if (tokenizer[0].toLowerCase() == 'update') {
                  console.log('pakar lia update\n');
                  var miniquery = dataQuery.slice(dataQuery.search(/where/i)); //will get the query after(inclusive) where
                  var dataToBeSentQuery = 'SELECT * FROM ' + tokenizer[1] + ' ' + miniquery;
                  console.log(dataToBeSentQuery);
                  User.getDataToBeSent(userSqlCon, dataToBeSentQuery, (err, res) => {
                    //console.log(res);
                    console.log(data.product_id + '  ss');
                    if (result.affectedRows > 0) io.in(data.product_id).emit('onDataReceived', res, 'Update');

                    //should use io.in if want to include sender else use socket.to('game').emit('nice game', "let's play a game");
                  });
                }
              }
            });
          }
        }
      });

      // console.log(client.rooms);//have to check if multiple clients join same room and why two room were created for one client
    });

    client.on('modifyQuery', function(data, callback) {
      var sockets = io.sockets.sockets;
      sockets.array.forEach(function(socket) {
        if (lsocket.id != client.id) {
        }
      });
    });
  });

  // client.on("foo", function(data) {
  //   console.log(data);
  // });
  client.on('disconnect', function() {
    console.log('disconnected ' + client.id);
    console.log('pr' + mproduct_id);
    console.log(global_socketio_users);
    console.log(client.id);
    global_socketio_users.forEach(element => {
      element.users.forEach((user, index) => {
        console.log(user);
        if (user == client.id) {
          element.users.splice(index, 1);
          element.count--;
        }
      });
    });
  });
});
////////////////////////////////databse connection/////////////////////////////////////////////

var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zybase',
});
conn.connect(err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('connected to zybase');
});

///////////////////////////////////////express middlewares////////////////////////////////////////

app.use(expressSession({secret: 'sherry', saveUninitialized: true, resave: true}));
app.use(cookieParser());
app.use(bodyparse.json());
app.use(bodyparse.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

//////////////////////////////////////pasprt config////////////////////////////////////////////////////
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function(email, password, done) {
      console.log('verifying user');
      userModel.authenticateUserByEmail(conn, email, password, (err, user) => {
        if (err) throw err;
        if (user == null) {
          done(null, false, {message: 'Invalid Credentials'});
          console.log('Invalid Credentials');
        } else {
          done(null, user[0]);
        }
      });
    }
  )
);
passport.serializeUser(function(user, done) {
  done(null, user.email); //unique key defined
});
passport.deserializeUser(function(email, done) {
  userModel.getUserByEmail(conn, email, function(err, user) {
    //can pass username because we have the object and unique key is defined username
    if (err) throw err;
    else if (user == null) console.log("user doesn't exist");
    else {
      done(err, user[0]);
    }
  });
});

//////////////////////////////////////////app//////////////////////////////////////////////////////

// app.listen(5000, e => {
//   if (e) throw e;
//   console.log('Server running at 5000');
// });

app.get('/', (req, res) => {
  userModel.getAllUsers(conn, (err, resu) => {
    if (err) throw err;
    res.json(resu);
  });
});
app.get('/checkauthenticated', (req, res) => {
  console.log('checkauthenticated ROUTE');

  if (req.user == null) {
    res.json({authenticate: 'false', statusCode: 400});
  } else {
    res.json({authenticate: 'true', statusCode: 200});
  }
});
app.get('/logout', (req, res) => {
  console.log('logout ROUTE');

  req.logout();
  res.json({message: 'Successfully Logged Out', statusCode: 200});
});
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/register.html');
});
app.post('/user/add', (req, res) => {
  user = [];
  user.username = req.body.username;
  user.first_name = req.body.first_name;
  user.last_name = req.body.last_name;
  user.password = req.body.password;
  user.product_id = req.body.product_id;
  user.email = req.body.email;

  userModel.createUser(conn, user, () => {
    res.redirect('/');
  });
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

//Login handling
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/loginSucessfull',
    failureRedirect: '/loginFailed',
  }),
  (req, res) => {
    console.log('LOGIN ROUTE');
    res.redirect('/');
  }
);
app.get('/loginSucessfull', function(req, res) {
  // res.send(req.user.username + " logged in");
  res.json({
    authenticate: 'true',
    message: 'Login Sucessful',
  });
});
app.get('/loginFailed', function(req, res) {
  res.json({
    authenticate: 'false',
    message: 'Invalid Credentials',
  });
});

//Register handling
app.post('/register', (req, res) => {
  console.log('Register ROUTE');

  console.log(req.body);
  userModel.createUser(conn, req.body, (err, msg) => {
    if (err == null) {
      res.json({message: msg, statusCode: 200});
    } else {
      console.log(err);
      res.json({message: err, statusCode: 400});
    }
  });
});

//sending tables

app.post('/getTable', (req, res) => {
  console.log('getTable ROUTE');

  var localConn = mysql.createConnection({
    host: 'localhost',
    user: req.user.product_id,
    password: req.user.api_key,
    database: req.user.product_id,
  });
  localConn.connect(err => {
    if (err) {
      console.log(err);
      return;
    }
    // console.log('connected to myown dtabase');
  });
  localConn.query('Select * from ' + req.body.tableName, (err, result, col) => {
    // console.log(result);
    // console.log(req.body.tableName);
    localConn.query('SHOW KEYS FROM ' + req.body.tableName, (err, resultpk) => {
      var mprimaryKey = [];
      var muniqueKey = [];
      if (err) console.log(err);
      for (var i = 0; i < resultpk.length; i++) {
        if (resultpk[i].Key_name == 'PRIMARY') {
          mprimaryKey.push(resultpk[i].Column_name);
        }
        if (resultpk[i].Key_name == resultpk[i].Column_name) {
          muniqueKey.push(resultpk[i].Column_name);
        }
      }

      res.json({
        data: result,
        column: col,
        uniqueKey: muniqueKey,
        primaryKey: mprimaryKey,
      });
    });
  });
});
// ********************   table query execute here *****************
app.post('/tableQueryExecute', (req, webRes) => {
  console.log('tableQueryExecute ROUTE');

  if (Object.keys(req.user).length > 0) {
    var qcon = mysql.createConnection({
      host: 'localhost',
      user: req.user.product_id,
      password: req.user.api_key,
      database: req.user.product_id,
    });
    qcon.connect(err => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('connected to', req.user.fullname);
    });
    let queryArr = req.body.tableQuery.split('\n');

    //mytest

    //incrementing in queryExecute limit array
    global_socketio_users.forEach(element => {
      if (element.product_id == req.user.product_id) {
        element.numQueries++;
      }
    });
    //Processing query and corresponding changes in room
    let dataQuery = queryArr[0];
    console.log(dataQuery + 'RECEIVED ADMINPANEL');

    //NOW CHECK IF QUERY IS MODIFYING TABLE INSERT UPDATE DELETE SO THEN ECHO THE MODIFIED DATA INTHE ROOM
    //if query is update
    var tokenizer = dataQuery.split(' ');

    if (tokenizer[0].toLowerCase() == 'create' || tokenizer[0].toLowerCase() == 'alter') {
      qcon.query(dataQuery, (err, res) => {
        yehle(queryArr, qcon, webRes, req);
      });
      return;
    }
    var deletedData = '';
    if (tokenizer[0].toLowerCase() == 'delete') {
      //getting delete data first because after execution data will be gone
      var miniquery = dataQuery.slice(dataQuery.search(/where/i)); //will get the query after(inclusive) where
      var dataToBeSentQuery = 'SELECT * FROM ' + tokenizer[2] + ' ' + miniquery;
      // console.log(dataToBeSentQuery);
      User.getDataToBeSent(qcon, dataToBeSentQuery, (err, res) => {
        if (err) throw err;
        deletedData = res;
        qcon.query(dataQuery, function(err, result, columns) {
          if (err) {
            throw err;
          } else {
            //response to that query is sent now sending responses to other room members
            console.log(dataQuery);
            //should use io.in if want to include sender else use socket.to('game').emit('nice game', "let's play a game");
            if (result.affectedRows > 0) io.in(req.user.product_id).emit('onDataReceived', deletedData, 'Delete');
            yehle(queryArr, qcon, webRes, req);
          }
        });
      });
    } else {
      qcon.query(dataQuery, function(err, result, columns) {
        if (err) {
          throw err;
        } else {
          //response to that query is sent now sending responses to other room members
          if (tokenizer[0].toLowerCase() == 'insert') {
            console.log('pakar lia insert      ');

            if (tokenizer[2].includes('(')) {
              tokenizer[2] = tokenizer[2].substring(0, tokenizer[2].indexOf('('));
            }
            var dataToBeSentQuery = `SELECT * FROM ${tokenizer[2]} where id=${result.insertId};`;
            console.log(dataToBeSentQuery);
            User.getDataToBeSent(qcon, dataToBeSentQuery, (err, res) => {
              // console.log(res);
              //should use io.in if want to include sender else use socket.to('game').emit('nice game', "let's play a game");
              io.in(req.user.product_id).emit('onDataReceived', res, 'Insert');
              yehle(queryArr, qcon, webRes, req);
            });
          } else if (tokenizer[0].toLowerCase() == 'update') {
            console.log('pakar lia update\n');
            var miniquery = dataQuery.slice(dataQuery.search(/where/i)); //will get the query after(inclusive) where
            var dataToBeSentQuery = 'SELECT * FROM ' + tokenizer[1] + ' ' + miniquery;
            console.log(dataToBeSentQuery);
            User.getDataToBeSent(qcon, dataToBeSentQuery, (err, res) => {
              //console.log(res);
              if (result.affectedRows > 0) io.in(req.user.product_id).emit('onDataReceived', res, 'Update');
              yehle(queryArr, qcon, webRes, req);

              //should use io.in if want to include sender else use socket.to('game').emit('nice game', "let's play a game");
            });
          }
        }
      });
    }
  }
});
function yehle(queryArr, qcon, webRes, req) {
  if (queryArr[1] != null) {
    qcon.query(queryArr[1], (err, result) => {
      console.log('andar wali query bhi chal gai');
      qcon.query('Select * from ' + req.body.tableName, (err, result, col) => {
        // console.log(result);
        console.log(req.body.tableName);
        qcon.query('SHOW KEYS FROM ' + req.body.tableName, (err, resultpk) => {
          if (err) {
            console.log(err);
            return;
          }
          var mprimaryKey = [];
          var muniqueKey = [];
          for (var i = 0; i < resultpk.length; i++) {
            if (resultpk[i].Key_name == 'PRIMARY') {
              mprimaryKey.push(resultpk[i].Column_name);
            }
            if (resultpk[i].Key_name == resultpk[i].Column_name) {
              muniqueKey.push(resultpk[i].Column_name);
            }
          }

          webRes.json({
            data: result,
            column: col,
            uniqueKey: muniqueKey,
            primaryKey: mprimaryKey,
          });
        });
      });
    });
  } else {
    qcon.query('Select * from ' + req.body.tableName, (err, result, col) => {
      //console.log(result);
      console.log(req.body.tableName);
      qcon.query('SHOW KEYS FROM ' + req.body.tableName, (err, resultpk) => {
        if (err) {
          console.log(err);
          return;
        }
        var mprimaryKey = [];
        var muniqueKey = [];
        for (var i = 0; i < resultpk.length; i++) {
          if (resultpk[i].Key_name == 'PRIMARY') {
            mprimaryKey.push(resultpk[i].Column_name);
          }
          if (resultpk[i].Key_name == resultpk[i].Column_name) {
            muniqueKey.push(resultpk[i].Column_name);
          }
        }

        webRes.json({
          data: result,
          column: col,
          uniqueKey: muniqueKey,
          primaryKey: mprimaryKey,
        });
      });
    });
  }
}

//   ********************   get table name **************************
app.get('/getTableName', (req, res) => {
  console.log('getTableName ROUTE');
  if (Object.keys(req.user).length > 0) {
    var mcon = mysql.createConnection({
      host: 'localhost',
      user: req.user.product_id,
      password: req.user.api_key,
      database: req.user.product_id,
    });
    mcon.connect(err => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('connected to', req.user.fullname);
    });
    mcon.query(
      "SELECT table_name FROM information_schema.tables where table_schema='" + req.user.product_id + "'",
      (err, result) => {
        // console.log('_________________');
        // console.log(result);
        // result.forEach((element, i) => {
        //   if (element.table_name == 'users') delete result[i];
        // });
        res.json(result);
      }
    );
  }
});
//terminal logic
app.post('/terminal', (req, res) => {
  console.log('terminal ROUTE');

  try {
    setTimeout(() => {
      if (Object.keys(req.user).length > 0) {
        var con = mysql.createConnection({
          host: 'localhost',
          user: req.user.product_id,
          password: req.user.api_key,
          database: req.user.product_id,
        });
        con.connect(err => {
          if (err) {
            console.log(err);
            return;
          }
          console.log('connected to', req.user.fullname);
        });
        con.query(req.body.query, (err, result, col) => {
          if (err) {
            console.log(err);
            obj = {error: true};
            obj.data = err;
            res.send(obj);
          } else {
            if (req.body.query.split(' ')[0].toLowerCase() == 'select') {
              obj = {table: true};
              obj.data = result;
              obj.column = col;
              con.query('SHOW KEYS FROM ' + req.body.query.split('from')[1], (err, resultpk) => {
                if (err) {
                  console.log(err);
                } else {
                  var mprimaryKey = [];
                  var muniqueKey = [];
                  for (var i = 0; i < resultpk.length; i++) {
                    if (resultpk[i].Key_name == 'PRIMARY') {
                      mprimaryKey.push(resultpk[i].Column_name);
                    }
                    if (resultpk[i].Key_name == resultpk[i].Column_name) {
                      muniqueKey.push(resultpk[i].Column_name);
                    }
                  }
                  obj.uniqueKey = muniqueKey;
                  obj.primaryKey = mprimaryKey;
                  res.json(obj);
                }
              });
            } else {
              obj = result;
              res.json(obj);
            }

            //console.log(result);
          }
        });
      } else {
        res.send('failed');
      }
    }, 0);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

app.get('/analytics', (req, res) => {
  console.log('analytics ROUTE');

  if (Object.keys(req.user).length > 0) {
    let obj = {};
    obj.product_id = req.user.product_id;
    obj.api_key = req.user.api_key;
    product_id = req.user.product_id;
    let idUser = null;
    global_socketio_users.forEach(element => {
      if (element.product_id == req.user.product_id) {
        idUser = element;
      }
    });

    if (idUser != null) {
      // console.log('helllo' + idUser.count + '  ');
      obj.currentUserCount = idUser.count;
      obj.QueriesPerHour = idUser.numQueries;
    } else {
      obj.currentUserCount = 0;
      obj.QueriesPerHour = 0;
    }
    var salCon = sql.createConnection({
      host: 'localhost',
      user: 'root',
      port: 3306,
      password: '',
    });
    salCon.connect(err => {
      if (err) {
        console.log(err);
      }
    });
    salCon.query(
      "SELECT COUNT(*) AS tableCount FROM information_schema.tables WHERE table_schema = '" + product_id + "';",
      (err, result) => {
        if (err) res.json(err);
        else {
          // console.log(result[0].tableCount);
          obj.tableCount = result[0].tableCount;
          salCon.query('SELECT COUNT(*) as COUNT FROM ' + product_id + '.users;', (err, result2) => {
            if (err) console.log(err);
            else {
              obj.userCount = result2[0].COUNT;
              // console.log(obj);
              res.json(obj);
            }
          });
        }
      }
    );
  }
});
app.get('/settings', (req, res) => {
  console.log(req.user);
  if (Object.keys(req.user).length > 0) {
    return res.json(req.user);
  } else {
    return res.json({error: true});
  }
});

app.post('/settings', (req, res) => {
  console.log(req.body);
  var sCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zybase',
  });
  sCon.connect(err => {
    if (err) {
      console.log(err);
      return;
    }
  });
  if (req.body.pChange == true) {
    opass = req.body.opass;
    npass = req.body.npass;
    console.log(req.user.password + ' ' + opass);
    if (req.user.password == opass) {
      console.log('bhoooooooooooooooooot');
      sCon.query("update Users set password='" + npass + "' where email = '" + req.user.email + "'", (err, result) => {
        if (err) {
          res.json({error: true, eMessage: err});
        } else {
          if (req.body.fullname != req.user.fullname) {
            sCon.query(
              "update Users set fullname='" + req.body.fullname + "' where email = '" + req.user.email + "'",
              (err, resu) => {
                if (err) {
                  res.json({error: true, eMessage: 'Server error'});
                } else {
                  console.log('lollllllllllllllll');
                  res.json({error: false, eMesssage: 'Full Name and Password changed Successfully '});
                }
              }
            );
          }
        }
      });
    } else {
      sCon.query(
        "update Users set fullname='" + req.body.fullname + "' where email = '" + req.user.email + "'",
        (err, resu) => {
          if (err) {
            res.json({error: true, eMessage: err});
          } else {
            res.json({error: false, eMessage: 'Profile Udated Successfully'});
          }
        }
      );
    }
  } else {
    sCon.query(
      "update Users set fullname='" + req.body.fullname + "' where email = '" + req.user.email + "'",
      (err, resu) => {
        if (err) res.json(err);
        else {
          res.json({error: false, eMessage: 'Profile Udated Successfully'});
        }
      }
    );
  }
});

app.post('/sendNotification', (req, res) => {
  console.log('YLALAH');
  io.in(req.user.product_id).emit('onNotificationReceived', req.body.title, req.body.text);
  res.json({success: true});
});
//
//
//
//
//

app.get('/mytest', (req, res) => {
  res.send(global_socketio_users);
});
app.post('/logintest', (req, res) => {
  console.log(req.body);
  res.redirect('/login');
});

app.post('/test', function(req, res) {
  console.log('yolo');
  console.log(req.body);
  res.send('hello world');
});

server.listen(5000, e => {
  if (e) throw e;
  console.log('Server running at 5000');
});
