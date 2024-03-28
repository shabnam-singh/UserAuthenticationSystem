var express=require("express");

const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
var cors=require("cors");
const multer=require('multer');

const port = process.env.PORT || 5000;

connectDb();
var app=express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', require("./routes/userRoutes"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

