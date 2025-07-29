// ----- INSTALL ALL OF THIS 
import express, { response } from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt, { decode } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
const salt = 10;

// ----- DB SETUP
const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ["POST", "GET","DELETE", "PUT", "PATCH"],
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
                req.user = decoded;
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
    return res.json({Status: "Success", id: req.user.id, name: req.name, admin: req.admin, delay: req.delay, completed: req.completed, late: req.late, shared: req.shared});
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

    const sql = "INSERT INTO login (name,`email`,`pass`) VALUES (?)";
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
                    const { id, name, admin, delay, completed, late, shared } = data[0];
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

// ----- SESSION FOR NOTES
app.post('/notes', verifyUser, (req, res) => {
    const { title, content } = req.body;
    const login_id = req.user.id;

    db.query(
        'INSERT INTO notes (login_id, title, content) VALUES (?, ?, ?)',
        [login_id, title, content],
        (err, result) => {
            if (err) return res.json({ Error: err });
            res.json({ id: result.insertId, title, content, login_id });
        }
    );
});

// ----- SESSION FOR NOTES PROTECTION
app.get('/notes', verifyUser, (req, res) => {
    const login_id = req.user.id;
    console.log("Fetching notes for user:", login_id);
    db.query('SELECT * FROM notes WHERE login_id = ?', [login_id], (err, result) => {
        if (err) return res.json({ Error: err });
        console.log("Notes result: Fetched");
        res.json(result);
    });
});

// ----- SESSION FOR PROFILE (Deleting notes) 
app.delete('/notes/:id', verifyUser, (req, res) => {
    const noteId = req.params.id;
    const login_id = req.user.id;

    db.query(
        'DELETE FROM notes WHERE id = ? AND login_id = ?',
        [noteId, login_id],
        (err, result) => {
            if (err) return res.status(500).json({ Error: "Database error", Details: err });

            if (result.affectedRows > 0) {
                console.log("Note deleted successfully");
                return res.status(200).json({ Status: "Deleted" });
                
            } else {
                return res.status(404).json({ Status: "Note not found or not authorized" });
            }
        }
    );
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

// ----- SESSION FOR CREATING TASK

// ----- SESSION FOR SCHEDULING



// ----- CHECKING DB CONNECTION 
app.listen(8081, () => {
    console.log("Database Connected...") 
})