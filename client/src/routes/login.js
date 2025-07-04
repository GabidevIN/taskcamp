import React, {useState, useEffect} from 'react'
import register from './register';
import { Link } from 'react-router-dom';


function Main() {
// ----- USER INPUT 
const [User, Setuser] = useState('');
const [Pass, SetPass] = useState('');
const [result, Setresult] = useState('')
// ----- USER INPUT 

const testing =() =>{
  const testt = String(Pass) + String(User)
  Setresult(testt)
}




  return (
    // ----- LOGIN GUI
    <>
        <form className="space-y-3 max-w-md mx-auto mt-10">
        <h1 className='text-center'>LOGIN SYSTEM</h1>
        <input value={User} className="border px-4 py-2 w-full rounded" placeholder='Enter Username' onChange={e => Setuser(e.target.value)}/>
        <input value={Pass} className="border px-4 py-2 w-full rounded" placeholder='Enter Password' onChange={e => SetPass(e.target.value)}/>
        <button onClick={testing} className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</button>
        <h1>MESSAGE:{result} </h1>
        <Link to = "/register" className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700" >Register</Link>
      </form>
    </>
  )
}

export default Main 