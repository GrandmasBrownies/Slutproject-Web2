const express = require('express');
const session = require('express-session');
const app = express();
const db = require('./connection');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const { body , validationResult } = require('express-validator');

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


let items = [];

let cart = [];

let favpost = [];

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
    res.render('share', { notLoggedInMsg: null })
 });

 app.get('/post', function(req,res){
    if (req.session.loggedIn) {
        res.render('post')
    } else {
        res.render('share', { notLoggedInMsg: "I'm sorry. You must be logged in to share a recipe" });
    }
 });

 app.get('/favourite', function(req,res){
    res.render('favourite', { favpost: favpost });
 });

 app.get('/grocery', function(req,res){
    res.render('grocery', { cart: cart, items: items });
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

 app.get('/register', function(req,res){
    res.render('register', { errors: null, errorMessage: null })
 });

 app.get('/login', function(req,res){
    res.render('login', { loginMsg: null })
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

 app.post('/addcart', function(req, res) {
    var ingredients = req.body.ingredients;
    db.query('SELECT ingredients FROM tabellnamn WHERE ingredients = ?', [ingredients], (err, results) => {
        if (err) {
            throw err;
        } else {
            const cart = results;
            res.render('grocery', { cart: cart , items: items });
        }
    });
});

app.post('/addfav', function(req, res) {
    var favId = req.body.favId
    db.query('SELECT * FROM tabellnamn WHERE id = ?', [favId], (err, results) => {
        if (err) {
            throw err;
        } else {
            const favpost = results;
            res.render('favourite', { favpost: favpost });
        }
    });
});


 app.post('/register',
 body('username').notEmpty().withMessage('Username is requried'),
 body('email').isEmail().withMessage('Invalid email adress'),
 body('password').notEmpty().withMessage('Password is requried').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
 function(req,res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', { errors: errors.array(), errorMessage: null });
    }

    const sqlSelect = "SELECT * FROM login WHERE username = ? OR email = ?";
    db.query(sqlSelect, [username, email], (err, results) => {
        if (err) {
            throw err;
        } else if (results.length > 0) {
            const errorMessage = results[0].username === username ? 'Username already exists' : 'email already exists';
            return res.render('register', { errors: null, errorMessage: errorMessage });
        } else {
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    const sqlInstert = "INSERT INTO login (username, email, password ) VALUES (?, ?, ?)";
                    db.query(sqlInstert, [username, email, hash], (err, result)=> {
                        if(err) {
                            throw err;
                        } else {
                            req.session.loggedIn = true;
                            res.redirect('home')
                        }
                    });
                });
            });
        };
    });
 });


 app.post('/login', function(req,res) {
    const usernameOrEmail = req.body.usernameOrEmail;
    const password = req.body.password;
    db.query('SELECT * FROM login WHERE (username = ? OR email = ?)', [usernameOrEmail, usernameOrEmail], (err, results) => {
        if (err) {
            throw (err);
        }
        if (results.length > 0) {
            const hashedPassword = results[0].password;
            bcrypt.compare(password, hashedPassword, function(err, result) {
                if (result === true) {
                    req.session.loggedIn = true;
                    res.render('login', { loginMsg: 'You are now logged in!' });
                } else {
                    res.send('Invalid username/email or password.');
                }
            });
        } else {
            res.send('Invalid username/email or password.');
        }
    });
 });


app.listen(process.env.PORT || 3000, function(){
   console.log('server, port 3000');
});