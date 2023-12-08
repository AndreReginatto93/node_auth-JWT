const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes")
const cookieParser = require("cookie-parser")
const {requireAuth,checkUser} = require("./middleware/authMiddleware")

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection

const dbURI = 'mongodb+srv://andrereginatto93:TkjhQZxUaJiAlfvK@cluster0.m4ptxqm.mongodb.net/node-auth';
mongoose.connect(dbURI, {})
  .then((result) => {
    const hostname = '127.0.0.1';
    const port = 3000;
    app.listen(port)
    console.log(`Server running at http://${hostname}:${port}/`);
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);