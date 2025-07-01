// ----- INSTALL ALL OF THIS 
import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
const salt = 10;

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
    database: "taskcamp"
})

// ----- REGISTRATION 
app.post('/register', (req,res) => {
    // ----- INSERTING INFORMATION
    const sql = "INSERT INTO login (`name`,`email`,`pass`) VALUES (?)";
    // ----- HASHING PASSWORD
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) =>{
        if(err) return res.json({Error: "Error for Hashing password"});
        const values = [
        req.body.name,
        req.body.email,
        hash
    ]
    // ----- INSERTING ERROR
    db.query(sql, [values], (err,result) =>{
        if(err) return res.json({Error: "Inserting Data Error in server"});
        return res.json({Status: "Success"});
    })
    })
})





// ----- CHECKING DB CONNECTION 
app.listen(8081, () => {
    console.log("Database Connected...") 
})