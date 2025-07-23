// ----- INSTALL ALL OF THIS 
import express, { response } from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
const salt = 10;

// ----- DB SETUP
const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

// ----- DB CONNECTION
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "131418",
    database: "taskcamp"
})

// ----- SESSION AND DATABASE CONNECTION
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not logged" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Invalid token" });
            } else {
                req.name = decoded.name;
                req.admin = decoded.admin;
                next();
            }
        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({Status: "Success", name: req.name, admin: req.admin});
})

app.get('/logout', (req, res) => {
    res.clearCookie("token");
    return res.json({Status: "Success"});
})

// ----- REGISTRATION 
app.post('/register', (req, res) => {
    const checking = 'SELECT * FROM login WHERE email = (?)';
    db.query(checking, [req.body.email], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: err });

        // ERROR DITO GAB -- di madetect ng system kapag may duplicate email 
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
app.post('/login', (req, res) => {
    const checking = 'SELECT * FROM login WHERE email = ?'; 
    db.query(checking, [req.body.email], (err, data) => {
        if (err) return res.json({Error: "Error checking email"});

        if (data.length > 0) {
            bcrypt.compare(req.body.pass.toString(), data[0].pass, (err, result) => {
                if(err) return res.json({Error: "Password Error"});
                
                if (result) {
                    const name = data[0].name;
                    const admin = !!data[0].admin; 
                    const token = jwt.sign({name,admin}, "jwt-secret-key", {expiresIn: '1d'});

                    res.cookie("token", token);

                    if(admin) {
                        return res.json({ Status: "Admin_Success" });
                    } else {
                        return res.json({ Status: "User_Success" });
                    }   
                } else {
                    return res.json({ Status: "Password not match" });
                }
            });
        } else {
            return res.json({Status: "Email not found"}); 
        }
    });
});


// ----- SESSION FOR INPUTING TASK AND VIEWING





// ----- SESSION FOR INPUTING TASK AND VIEWING



// ----- CHECKING DB CONNECTION 
app.listen(8081, () => {
    console.log("Database Connected...") 
})