const express = require ('express');
const ejs = require ('ejs');
const mongoose = require ('mongoose');
const app = express ();

const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

const systemRouter = require ('./routes/system');
const Users = require ('./models/users');

const dbURI = "mongodb+srv://suphal_athlur:simplisticpassword@cluster0.jizovm2.mongodb.net/bulls-and-cows?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    app.listen(3000, 'localhost', () => {
      console.log("Connected");
    });
  })
  .catch(err => console.log(err));

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
  res.render('home.ejs', { name: req.user.name })
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let sv = new Users({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    await sv.save();
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

app.get('/home',checkAuthenticated,(req,res) => {
  res.render('home_page');
});

app.get('/single_player',checkAuthenticated,(req,res) => {
  res.render('single_player');
});

app.get('/stats',checkAuthenticated,async (req,res) => {
  let pass =  await require ('./process/statGen') (req.user.name);
  res.render('stats',pass);
});

app.use('/system_player',checkAuthenticated,systemRouter);
