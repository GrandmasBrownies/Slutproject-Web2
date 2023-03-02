const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'Gandalf',
  password: '1234',
  database: 'slut_projekt'
});

db.connect(function(err){
  if(err) {
      console.log(err);
  } else {
      console.log('connected to mySQL');
  }
});


module.exports = db;