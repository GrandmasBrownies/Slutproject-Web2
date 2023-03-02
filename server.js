const express = require('express');
const app = express();
const db = require('./connection');

const path = require('path');
const upload = require('./upload');
app.use(express.static(path.resolve('./public')));



var obj = {};

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs');


app.get('/', function(req,res){
    let sql = 'SELECT * FROM tabellnamn ORDER BY date DESC';
    db.query(sql, function(err, results){
        if(err) {
            throw err;
        } else {
            obj = {data: results};
            console.log(obj)
            res.render('index', obj)
        }
    });
});



app.get('/post', function(req,res){
    res.render('post')
 });

 app.post('/post', upload.single('img'), function(req,res){
    const title = req.body.title;
    const text = req.body.text;
    const img = "/uploads/" + req.file.filename;
    const sqlInstert = "INSERT INTO tabellnamn (text1, text2, text3) VALUES (?, ?, ?);"
    db.query(sqlInstert, [title, text, img], (err, result)=> {
        if(err) {
            throw err;
        } else {
            res.render ('index');
        }
    });
 });
 


app.listen(process.env.PORT || 3000, function(){
   console.log('server, port 3000');
});