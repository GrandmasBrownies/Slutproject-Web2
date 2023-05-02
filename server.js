const express = require('express');
const app = express();
const db = require('./connection');

const path = require('path');
const upload = require('./upload');
app.use(express.static(path.resolve('./public')));


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs');


var groclist = {};


let items = [];

app.get('/grocery', function(req,res){
    res.render('grocery', { items: items });
    let sql = 'SELECT * FROM tabellnamn ORDER BY date DESC';
    db.query(sql, function(err, results){
        if(err) {
            throw err;
        } else {
            obj = {data: results};
            console.log(groclist)
            res.render('home', groclist);
        }
    });
});


app.post('/add', (req, res) => {
    const newItem = req.body.item;
    items.push(newItem);
    res.redirect('/grocery');
  });

 app.post('/remove', (req, res) => {
    const removeItem = req.body.item;
    items = items.filter(item => item !== removeItem);
    res.redirect('/grocery');
 });
    
var obj = {};


 app.get('/home', function(req,res){
   let sql = 'SELECT * FROM tabellnamn ORDER BY date DESC';
   db.query(sql, function(err, results) {
        if(err) {
            throw err;
        } else {
            obj = {data: results};
            console.log(obj)
            res.render('home', obj)
        }
   });
 });

 app.get('/postLayouts/default:id', function(req,res) {
    const id = req.params.id;
    res.render('default')
 });


 app.get('/share', function(req,res){
    res.render('share')
 });

 app.get('/post', function(req,res){
    res.render('post')
 });

 app.get('/favourite', function(req,res){
    res.render('favourite')
 });

 app.get('/grocery', function(req,res){
    res.render('grocery', { items: items });
 });

 app.get('/signin', function(req,res){
    res.render('signin')
 });

 app.get('/signup', function(req,res){
    res.render('signup')
 });

 app.post('/post', upload.single('img'), function(req,res){
    const title = req.body.title;
    const text = req.body.text;
    const img = "/uploads/" + req.file.img;
    const sqlInstert = "INSERT INTO tabellnamn (text1, text2, text3) VALUES (?, ?, ?);"
    db.query(sqlInstert, [title, text, img], (err, result)=> {
        if(err) {
            throw err;
        } else {
            res.redirect('home')
        }
    });
 });


app.listen(process.env.PORT || 3000, function(){
   console.log('server, port 3000');
});