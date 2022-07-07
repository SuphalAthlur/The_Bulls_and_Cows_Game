const express = require ('express');
const ejs = require ('ejs');
const mongoose = require ('mongoose');
const app = express ();
const systemRouter = require ('./routes/system');

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
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res) => {
  res.redirect('/home');
});

app.get('/home',(req,res) => {
  res.render('home_page');
});

app.get('/single_player',(req,res) => {
  res.render('single_player');
})

app.use('/system_player',systemRouter);