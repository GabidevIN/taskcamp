import React from 'react'
import { Link } from 'react-router-dom';
import Login from './login'


function register() {
  return (
    <>
    <form>
      <input placeholder='Enter Name'/>
      <input placeholder='Enter Email'/>
      <input placeholder='Enter Password'/>
      <button>SIGN UP</button>
    </form>

    <Link to="/login">LOGIN</Link>
    </>
  )
}

export default register