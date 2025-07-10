import React from 'react'
import Register from './register'
import LOGIN from './login'
import { Link } from 'react-router-dom';



function home() {
  return (
    <>
    <div className='bg-black w-screen h-screen text-center'>
    <Link to="/Register" className='text-black bg-white'>Register</Link>
    <Link to="/Login" className='text-black bg-white'>LOGIN</Link>
    </div>
    </>
  )
}

export default home