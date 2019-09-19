const mysql = require('promise-mysql');

pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'blog',
    password: '',
    connectionLimit: 10
  });
   
  function getSqlConnection() {
    return pool.getConnection().disposer((connection) =>  pool.releaseConnection(connection));
  }
   
  module.exports = getSqlConnection;