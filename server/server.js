// ----- INSTALL ALL OF THIS 
import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// ----- DB SETUP
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// ----- DB CONNECTION
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "131418",
    database: ""
})

// ----- REGISTRATION 
app.post('/register', (req,res) => {
    const sql = "INSERT INTO login ('name','email','pass') VALUES (?)";
})





// ----- CHECKING DB CONNECTION 
app.listen(8081, () => {
    console.log("Database Connected...") 
})