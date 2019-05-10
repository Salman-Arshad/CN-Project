var crypto = require('crypto');
sql = require('mysql');
exports.getAllUsers = function(conn, callback) {
  conn.query('select * from users', (err, res) => {
    if (err) callback(err, null);
    else {
      callback(null, res);
      return;
    }
  });
};
exports.createUser = function(conn, user, callback) {
  if (checkValidity(user) == false) {
    callback('Invalid data', null);
    return;
  }
  //Checking Unique Email_id
  query3 = `Select * from users where email='${user.email}'`;
  conn.query(query3, (err, res) => {
    if (res.length > 0) {
      callback('Email already Exist', null);
    } else {
      //checking unique product_id and api_key 2 Levels after that showing failure msg
      var product_id = crypto.randomBytes(8).toString('hex'); // ⇨ 'a377751841ada0e0' //here the product id will be double of argument which is 8
      var api_key = crypto.randomBytes(8).toString('hex'); // ⇨ 'e4898031e7de6fe7'

      query2 = `Select * from users where api_key='${api_key}' AND product_id='${product_id}'`;
      conn.query(query2, (err, res) => {
        if (res.length > 0) {
          product_id = crypto.randomBytes(8).toString('hex');
          api_key = crypto.randomBytes(8).toString('hex');
          query2 = `Select * from users where api_key='${api_key}' AND product_id='${product_id}'`;
          conn.query(query2, (err, res) => {
            if (res.length > 0) {
              callback('Api Key and Product Key not unique', null);
            } else {
              console.log('Random 1 time failed to unique');
              helperCreateUser(callback, user, product_id, api_key, conn);
            }
          });
        } else {
          helperCreateUser(callback, user, product_id, api_key, conn);
        }
      });
    }
  });
};

function helperCreateUser(callback, user, product_id, api_key, conn) {
  query =
    "Insert into users (email,fullname,password,product_id,api_key,is_active,is_verified) values ('" +
    user.email +
    "','" +
    user.fullname +
    "','" +
    user.password +
    "','" +
    product_id +
    "','" +
    api_key +
    "'," +
    1 +
    ',' +
    1 +
    ')';
  conn.query(query, (er, res) => {
    if (er) callback(err, null);
    console.log(user.fullname + ' sucessfully registered');
    //callback(null, "Wow");
    createRespectiveDatabase(callback, conn, user, product_id, api_key);
  });
}
function createRespectiveDatabase(callback, connection, user, product_id, api_key) {
  connection.beginTransaction(function(err) {
    if (err) {
      throw err;
    }
    var query55 = "CREATE USER '" + product_id + "'@'localhost' IDENTIFIED BY '" + api_key + "'";

    /*                                  QUERY TO BE ADDED GRANT SELECT,INSERT ON 73da01b6a5e47562.* TO '73da01b6a5e47562'@'localhost'        */

    console.log(query55);
    connection.query(query55, function(error, results, fields) {
      if (error) {
        return connection.rollback(function() {});
      }
      var query56 = `GRANT SELECT,INSERT,CREATE,DROP,DELETE,UPDATE,ALTER ON ${product_id}.* TO '${product_id}'@'localhost'`;
      console.log(query56);
      connection.query(query56, function(error, results, fields) {
        if (error) {
          console.log('Grant mein error');
          return connection.rollback(function() {});
        }
        var query66 = 'CREATE DATABASE ' + product_id;
        console.log(query66);
        connection.query(query66, (err, res) => {
          if (err) {
            connection.rollback(err => {
              throw err;
            });
          }
          console.log("user's database created");
          var query77 =
            'CREATE TABLE ' +
            product_id +
            '.users ( id INT NOT NULL AUTO_INCREMENT , username VARCHAR(255) NOT NULL , email VARCHAR(255) NOT NULL , password VARCHAR(255) NOT NULL , full_name VARCHAR(255) NOT NULL , PRIMARY KEY (`id`), UNIQUE (email));';
          console.log(query77);
          connection.query(query77, (err, res) => {
            if (err) {
              console.log(err + 'bhund');
              throw err;
              connection.rollback(err => {
                if (err) {
                  console.log(err + 'bhund2');
                  throw err;
                }
              });
            } else {
              connection.commit(err => {
                if (err) {
                  console.log(err + 'bhund 3');
                  connection.rollback();
                  throw err;
                } else {
                  console.log('done and dustd');
                  return callback(null, 'database and user created!! ');
                }
              });
            }
          });
        });
      });
    });
  });
}

function checkValidity(user) {
  //functions to check emptyness email id and blah blah
}

exports.authenticateUserByEmail = function(conn, email, password, callback) {
  query = "select * from users where (email='" + email + "') AND password='" + password + "'";
  conn.query(query, (err, res) => {
    if (err) throw err;
    else if (res.length > 0) {
      callback(null, res);
    } else {
      callback(null, null);
    }
  });
};

exports.getDataToBeSent = function(conn, querySelect, callback) {
  conn.query(querySelect, (err, res) => {
    if (err) throw err;
    else {
      callback(null, res);
    }
  });
};

exports.getUserByEmail = function(conn, email, callback) {
  query = "select * from users where email='" + email + "'";
  conn.query(query, (err, res) => {
    if (err) throw err;
    else if (res.length > 0) {
      callback(null, res);
    } else {
      callback(null, null);
    }
  });
};

exports.validateClient = function(conn, product_id, api_key, callback) {
  query = "SELECT * FROM USERS WHERE product_id ='" + product_id + "' AND api_key='" + api_key + "'";
  conn.query(query, (err, res) => {
    if (err) throw err;
    if (res.length > 0) callback(null, true);
    else callback(null, false);
  });
};
exports.checkValidDataQuery = function(query, callback) {
  query = query.toLowerCase();
  //console.log(query);
  if (
    query.includes('create table') ||
    query.includes('create database') ||
    query.includes('alter table') ||
    query.includes('create index') ||
    query.includes('drop database') ||
    query.includes('drop table')
  ) {
    console.log("Not enough permission to execute '" + query + "' Use admin panel for execution of this query");
    callback("Not enough permission to execute '" + query + "' Use admin panel for execution of this query", false);
  } else {
    callback(null, true);
  }
};
