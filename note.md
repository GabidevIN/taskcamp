# TASKCAMP (note taking // productivity app)

## Ideas
- Add admin dashboard
- Use JWT for session handling



## To-Do
- Learn Node.js
- Set up MySQL database
- Create API for user status


## DATABASE SETUP
- CREATE DATABASE taskcamp
- USE taskcamp
- CREATE TABLE login (
    id INT AUTO_INCREATEMENT PRIMARY KEY, 
    email VARCHAR(225) not null unique, 
    pass VACHAR(225) not null, 
    name VARCHAR(225) not null unique, 
    admin BOOLEAN DEFAULT FALSE;
    completed INT;
    delay INT;
    late INT;
    created INT; 
    shared INT;
 )

- CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

- CREATE TABLE sched (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES login(id) ON DELETE CASCADE
);

- CREATE TABLE task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES login(id) ON DELETE CASCADE
);