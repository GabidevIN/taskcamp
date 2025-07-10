import React from 'react'
import Register from './register'
import LOGIN from './login'
import { Link } from 'react-router-dom';



function home() {
  return (
    <>
    home
    <Link to="/Register">Register</Link>
    <Link to="/Login">LOGIN</Link>

    </>
  )
}

export default home