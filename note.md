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
 )
