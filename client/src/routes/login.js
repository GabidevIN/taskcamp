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
      <h1>LOGIN SYSTEM</h1>
      <input value={User} placeholder='Enter Username' onChange={e => Setuser(e.target.value)}/>
      <input value={Pass} placeholder='Enter Password' onChange={e => SetPass(e.target.value)}/>
      <button onClick={testing}>LOGIN</button>
      <h1>MESSAGE:{result} </h1>
      <Link to = "/register">Register</Link>
    </>
  )
}

export default Main 