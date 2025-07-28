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
                req.id = decoded.id;
                req.name = decoded.name;
                req.delay = decoded.delay;
                req.completed = decoded.completed;
                req.late = decoded.late;
                req.shared = decoded.shared;
                req.admin = decoded.admin;
                req.login = decoded;

                next();
            }
        })
    }
}

// ----- SESSION VERIFICATIONs
app.get('/', verifyUser, (req, res) => {
    return res.json({Status: "Success", id: req.id, name: req.name, admin: req.admin, delay: req.delay, completed: req.completed, late: req.late, shared: req.shared});
})

// ----- SESSION LOGOUT
app.get('/logout', (req, res) => {
    res.clearCookie("token");
    return res.json({Status: "Success"});
})

// ----- REGISTRATION 
app.post('/register', (req, res) => {
    const checking = 'SELECT * FROM login WHERE email = (?)';
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
                    const delay = data[0].delay;
                    const completed = data[0].completed;
                    const late = data[0].late;
                    const shared = data[0].shared;
                    const id = data[0].id;


                    const token = jwt.sign({id,name,admin,delay,completed,late,shared}, "jwt-secret-key", {expiresIn: '1d'});

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


// ----- SESSION FOR CREATING TASK

// ----- SESSION FOR SCHEDULING

// ----- SESSION FOR NOTES
app.post('/notes', verifyUser, (req, res) => {
    const { title, content } = req.body;
    const user_id = req.login.name;
    




});








// ----- SESSION FOR PROFILE ( WITH GRADE DISPALY )
app.get('/profile', verifyUser, (req, res) => {
    const sql = 'SELECT * FROM login WHERE name = ?';
    db.query(sql, [req.name], (err, result) => {
        if (err) return res.json({ Error: "Error fetching profile" });
        if (result.length > 0) {
            return res.json({ Status: "Success", data: result[0] });
        } else {
            return res.json({ Status: "No profile found" });
        }
    });
});



// ----- CHECKING DB CONNECTION 
app.listen(8081, () => {
    console.log("Database Connected...") 
})