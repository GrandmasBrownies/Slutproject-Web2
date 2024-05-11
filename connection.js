const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'Gandalf',
  password: 'uBY8-Lw5Vfy5qz4s',
  database: 'grocery_db'
});

db.connect(function(err){
  if(err) {
      console.log(err);
  } else {
      console.log('connected to mySQL');
  }
});


module.exports = db;