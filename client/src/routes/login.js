import React, {useState} from 'react'
import register from './register';
import Home from './home';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login() {
// ----- USER INPUT 
  const [values, setValues] = useState({email: '', pass: ''})
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/login', values)
    .then(res => {
      if (res.data.Status === "Success") {
        navigate('/home')
      } else {
        alert("Incorrect Email or Password // ERROR ");
      
      }
    })
    .catch(err => {
      console.log("Axios error:", err);
      alert("Something went wrong with the server.");
    });
}
  return (
    // ----- LOGIN GUI
    <>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto mt-10">
          <h1 className='text-center'>LOGIN SYSTEM</h1>
          <input className="border px-4 py-2 w-full rounded" required type='email'  placeholder='Enter Email' onChange={e => setValues({...values, email: e.target.value})}/>
          <input className="border px-4 py-2 w-full rounded" placeholder='Enter Password' onChange={e => setValues({...values, pass: e.target.value})}/>
          <button type="submit" className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</button>
          <h1 className='text-center'>NO ACCOUNT?</h1>
          <Link to = "/register" className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700" >Register</Link>
      </form>
    </>
  )
}

export default Login 