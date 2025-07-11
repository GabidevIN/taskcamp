// ----- INSTALL ALL OF THIS 
import express from 'express';
import mysql from 'mysql2';
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
app.post('/register', (req, res) => {
    const checking = "SELECT * FROM login WHERE email = (?)";
    db.query(checking, [req.body.email], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: err });

        if (result.length > 0) {
        return res.json({ Status: "Duplicate" });
        }

    const sql = "INSERT INTO login (`name`,`email`,`pass`) VALUES (?)";
    bcrypt.hash(req.body.pass.toString(), salt, (err, hash) => {
        if(err) return res.json({Error: "Error for hashing password"});
        const values = [
            req.body.name,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (err, result) =>{
            if (err) {
                console.error("MySQL Insert Error:", err);
                return res.json({ Error: "INSERTING DATA TO SERVER ERRORR" });
            }
            return res.json({ Status: "Success" });
            });
        })
    })
})

// ----- LOGIN // SESSION SYSTEM




// ----- USER SESSION AND DATABASE CONNECTION



// ----- SESSION FOR INPUTING TASK AND VIEWING




// ----- CHECKING DB CONNECTION 
app.listen(8081, () => {
    console.log("Database Connected...") 
})