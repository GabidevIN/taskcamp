import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showReg, setShowReg] = useState(false);

const handleAuthClick = (type) => (e) => {
  e.preventDefault();
  setShowLogin(type === "login");
  setShowReg(type === "register");
};

const showreg = () => {
  setShowLogin(false);
  setShowReg(true);
};

const showlog = () => {
  setShowLogin(true);
  setShowReg(false);
};

const closebtn = () => {
  setShowLogin(false);
  setShowReg(false);
};
// ----- REGISTRATION SYSTEM

  const [regis, regvalue] = useState({ name: '', email: '', pass: ''})
  const navigate = useNavigate();
  const regisSub = (event) => {
    event.preventDefault();

// ----- MUST FILLED BY USER 
    if(!regis.name || !regis.email || !regis.pass) {
      alert("Please fill all fields");
      return;
    }   

// ----- ACCOUNT CREATION (IF FILLED)
    axios.post('http://localhost:8081/register', regis)
    .then(res => {
      if (res.data.Status === "Success") {
        alert("ACCOUNT CREATED");
        navigate('/main')
      } 

      else if (res.data.Status === "Duplicate") {
        alert("ACCOUNT EXISTED");
      } 
      else {
        alert("ERROR CREATING ACCOUNT");
      }
    })
    .then(err => console.log(err));
  }

// ----- LOGIN SYSTEM
  const [login, loginvalue] = useState({email: '', pass: ''})
  axios.defaults.withCredentials = true;
  const loginSub = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/login', login)
    .then(res => {
      if (res.data.Status === "User_Success") {
        navigate('/main')
      } else if (res.data.Status === "Admin_Success") {
        navigate('/admin/adminMain')
      } else {
        alert("Incorrect Email or Password");
      }
    })
    .catch(err => {
      console.log("Axios error:", err);
      alert("Something went wrong with the server.");
    });
}


return (
  <>
  <title>TASKCAMP</title>
    <div className="w-screen h-screen bg-gradient-to-r from-[#948997] to-[#393e3e] text-white p-4 rounded">
      <nav className='flex justify-center gap-4'>
        <a href="#" className='text-black bg-white rounded-e-md border border-black p-2' onClick={handleAuthClick("login") }>Login</a>
        <a href="#" className='text-black bg-white rounded-e-md border border-black p-2' onClick={handleAuthClick("register")}>Register</a>
      </nav>

{/*----- LOGIN FORM // HIDDEN -----*/}
{showLogin && (
  <div className='bg-white text-black p-4 rounded w-fit max-w-md mx-auto my-4'>
    <div>
      <button onClick={closebtn}>Close</button>
      <h2 className='text-center font-bold '>LOGIN</h2>
      <form onSubmit={loginSub} className="space-y-3 max-w-md mx-auto mt-10">
          <h1 className='text-center'>LOGIN SYSTEM</h1>
          <input className="border px-4 py-2 w-full rounded" required type='email'  placeholder='Enter Email' onChange={e => loginvalue({...login, email: e.target.value})}/>
          <input className="border px-4 py-2 w-full rounded" type='password' placeholder='Enter Password' onChange={e => loginvalue({...login, pass: e.target.value})}/>
          <button type="submit" className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</button>
          <h1 className='text-center'>NO ACCOUNT?</h1>
          <button onClick={showreg} className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700" >Register</button>
      </form>
    </div>
  </div>      
)}

{/*----- REGISTRATION FORM // HIDDEN -----*/}
{showReg && (
  <div className='bg-white text-black p-4 rounded w-fit max-w-md mx-auto my-4'>
    <div>
      <button onClick={closebtn}>Close</button>
      <h1 className='text-center'>REGISTER</h1>
      <form onSubmit={regisSub} className="space-y-3 max-w-md mx-auto mt-10"> 
        <input placeholder='Enter Name' 
        onChange={e => regvalue({...regis, name: e.target.value})} 
        className="border px-4 py-2 w-full rounded"/>

        <input placeholder='Enter Email' 
        required type="email"
        onChange={e => regvalue({...regis, email: e.target.value})} 
        className="border px-4 py-2 w-full rounded"/>

        <input placeholder='Enter Password' 
        onChange={e => regvalue({...regis, pass: e.target.value})} 
        className="border px-4 py-2 w-full rounded"/>
        
        <button type="submit" className="bg-green-600 text-white px-4 py-2 w-full rounded-none hover:bg-green-700">SIGN UP</button>
        <h1 className='text-center'>ALREADY HAVE ACCOUNT</h1>
        <button onClick={showlog} className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</button>
      </form>
    </div>
  </div>
)}
      </div>
    </>
  )
}

export default Home