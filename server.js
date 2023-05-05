const express = require('express');
const session = require('express-session');
const app = express();
const db = require('./connection');

const path = require('path');
const upload = require('./upload');
app.use(express.static(path.resolve('./public')));
app.use(session({
    secret: 'banana69',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

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

 app.get('/recipe/:id', function(req,res) {
    const recipeId = req.params.id;
    db.query('SELECT * FROM tabellnamn WHERE id = ?', [recipeId], function(error, results) {
        if (error) {
            console.error(error);
            return;
        }
        const recipe = results[0];
        res.render('recipe', { recipe: recipe });
    });
 });


 app.get('/share', function(req,res,){
    res.render('share')
 });

 app.get('/post', function(req,res){
    if (req.session.loggedIn) {
        res.render('post')
    } else {
        res.redirect('/share + say that the user must be logged in');
    }
 });

 app.get('/favourite', function(req,res){
    res.render('favourite')
 });

 app.get('/grocery', function(req,res){
    res.render('grocery', { items: items });
 });

 app.get('/register', function(req,res){
    res.render('register')
 });

 app.get('/login', function(req,res){
    res.render('login')
 });


 app.post('/post', upload.single('img'), function(req,res){
    const title = req.body.title;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    const img = "/uploads/" + req.file.img;
    const sqlInstert = "INSERT INTO tabellnamn (text1, ingredients, instructions, text3 ) VALUES (?, ?, ?, ?);"
    db.query(sqlInstert, [title, ingredients, instructions, img], (err, result)=> {
        if(err) {
            throw err;
        } else {
            res.redirect('home')
        }
    });
 });

 app.post('/register', function(req,res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const sqlInstert = "INSERT INTO login (username, email, password ) VALUES (?, ?, ?)";
    db.query(sqlInstert, [username, email, password], (err, result)=> {
        if(err) {
            throw err;
        } else {
            res.redirect('home')
        }
    });
 });

 app.post('/login', function(req,res) {
    const usernameOrEmail = req.body.usernameOrEmail;
    const password = req.body.password;
    db.query('SELECT * FROM login WHERE (username = ? OR email = ?) AND password = ?', [usernameOrEmail, usernameOrEmail, password], (err, results) => {
        if (err) {
            throw (err);
        }
        if (results.length > 0) {
            req.session.loggedIn = true;
            res.redirect('some type of welcome');
        } else {
            res.redirect('some type of did not find user');
        }
    });
 });


app.listen(process.env.PORT || 3000, function(){
   console.log('server, port 3000');
});