const mongoose = require('mongoose');
const express = require('express');
const session= require('express-session');
const path = require('path');

const app = express();
const port =  5000;
const Db_uri = "mongodb+srv://wasifwwez:wasifwwez@test.bhxtckd.mongodb.net/?retryWrites=true&w=majority&appName=test";

// database connection
mongoose.connect(Db_uri,{useNewUrlParser:true,  useUnifiedTopology: true});
const db = mongoose.connection;
db.on("error", (error)=>console.log(error));
db.once("open", ()=>console.log("connected to database!"));


// middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({secret:'my secret key', saveUninitialized:true, resave:false}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.use((req, res, next)=>{
    res.locals.message= req.session.message;
    delete  req.session.message;
    next();
});



// set template engine
app.set('view engine', 'ejs');

//routes
app.use("", require("./routes/routes"));

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});