import {useState, useEffect} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';


function Main() {
// ----- SESSION SYSTEM
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(false);


  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:8081')
    .then(res => {
      console.log(res.data);
      if (res.data.Status === "Success") {
        setName(res.data.name);
        setStatus(res.data.admin);

        if (Number(res.data.admin) === 1) {
          setMessage('You are logged in as an Admin');
          setAuth(false);
        } else {
          setAuth(true);
        } 
        
      } else {
        setAuth(false);
        setMessage(res.data.Error);
      }
    })
  .then(err => console.log(err));
  }, [])


  const logout = () => {
    axios.get('http://localhost:8081/logout')
    .then(res => {
      window.location.reload(true);
    }).catch(err => console.log(err));
  }

// ----- System displays





// ----- function button

return (
  <>   
    <div className="bg-[#BCA88D] h-screen w-screen">
    <title>MAIN</title>
    {    
      auth ?
      <>
{/*----- NAVBAR -----*/}
        <div className="bg-[#3E3F29] p-4 h-screen w-[350px] fixed left-0 top-0 z-10 drop-shadow-lg">
          <nav className="flex flex-col flex-grow gap-5 justify-center items-center h-full p-4">
            <Link to="/Schedule" className="bg-gray-700 text-center w-32 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
            SCHEDULE</Link>
            
            <Link to="/Notes" className="bg-gray-700 text-center w-32 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
            NOTE</Link>

            <Link to="/Profile" className="bg-gray-700 text-center w-32 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
            PROFILE</Link>

            <Link to="/Createtask" className="bg-gray-700 text-center w-32 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
            CREATE TASK</Link>
          </nav>
        </div>

{/*----- WELCOME SECTION -----*/}
        <div className="w-screen bg-[#3E3F29] h-14 z-5 fixed flex justify-start pl-[23rem] items-center shadow-md gap-4">
            <Link to="/" onClick={logout} className="bg-red-400 text-center w-[10rem] text-white px-4 py-2 rounded hover:bg-green-400 transition">
            LOGOUT</Link>
        </div>

{/*----- HERO SECTION -----*/}

<h3 className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl z-20">
  Welcome, {name}!
</h3>







      </>

        /* USER IS NOT AUTHENTICATED*/
        :
      <>
        <h3>{message}</h3>
        <h3>Login Now</h3>
        <Link to = "/" className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</Link>
      </>
    }
    </div>
  </>
  )
}

export default Main