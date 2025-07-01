import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import Login from './login'
import axios from 'axios';


function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/register', values)
      .then(res => console.log(res))
      .then(err => console.log(err));
  }



  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto mt-10"> 
      <input placeholder='Enter Name' 
      onChange={e => setValues({...values, name: e.target.value})} 
      className="border px-4 py-2 w-full rounded"/>

      <input placeholder='Enter Email' 
      onChange={e => setValues({...values, email: e.target.value})} 
      className="border px-4 py-2 w-full rounded"/>

      <input placeholder='Enter Password' 
      onChange={e => setValues({...values, password: e.target.value})} 
      className="border px-4 py-2 w-full rounded"/>
      
      <button type="submit" className="bg-green-600 text-white px-4 py-2 w-full rounded-none hover:bg-green-700">SIGN UP</button>
      <h1 className='text-center'>ALREADY HAVE ACCOUNT</h1>
      <Link to="/login" className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</Link>
    </form>
    </>
  );
}

export default Register