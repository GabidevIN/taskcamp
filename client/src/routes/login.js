import React, {useState, useEffect} from 'react'
import register from './register';
import { Link } from 'react-router-dom';


function Main() {
// ----- USER INPUT 
  const [values, setValues] = useState({email: '', pass: ''})




  return (
    // ----- LOGIN GUI
    <>
        <form className="space-y-3 max-w-md mx-auto mt-10">
        <h1 className='text-center'>LOGIN SYSTEM</h1>
        <input className="border px-4 py-2 w-full rounded" placeholder='Enter Username' onChange={e => setValues({...values, email: e.target.value})}/>
        <input className="border px-4 py-2 w-full rounded" placeholder='Enter Password' onChange={e => setValues({...values, pass: e.target.value})}/>
        <button className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</button>
        <Link to = "/register" className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700" >Register</Link>
      </form>
    </>
  )
}

export default Main 