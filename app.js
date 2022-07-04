const express = require ('express');
const ejs = require ('ejs');
const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.listen(3000, err =>{
  if (err==null) console.log("Listening to requests on PORT 3000");
});

app.get('/',(req,res) => {
  res.redirect('/home');
});

app.get('/home',(req,res) => {
  res.render('home_page');
});

app.get('/single_player',(req,res) => {
  res.render('single_player');
})

app.get('/system_player',(req,res) => {
  res.render('system_player');
})