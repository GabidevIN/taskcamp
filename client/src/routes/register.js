import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import Login from './login'
import axios from 'axios';


function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    pass: ''
  });

  const hanedleSubmit = (event) => {
    event.preventDefault();
    axios.post('')
  }

  return (
    <>
    <form onSubmit={hanedleSubmit}> 
      <input placeholder='Enter Name' onChange={e => setValues({...values, name: e.target.value})}/>
      <input placeholder='Enter Email' onChange={e => setValues({...values, email: e.target.value})}/>
      <input placeholder='Enter Password' onChange={e => setValues({...values, pass: e.target.value})}/>
      <button>SIGN UP</button>
    </form>

    <Link to="/login">LOGIN</Link>
    </>
  );
}

export default Register