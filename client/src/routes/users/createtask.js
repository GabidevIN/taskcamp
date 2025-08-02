import {useState, useEffect} from 'react'
import Login from '../login';
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
    <div className="w-screen h-screen bg-gradient-to-r from-[#948997] to-[#393e3e] text-white p-4 rounded">
    {    
      auth ?
      <>
        <h3 className="text-center text-2xl mb-4">Welcome, {name}!</h3>
          <div className="flex gap-2 mb-4">
            <Link to="/" onClick={logout} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">LOGOUT</Link>
            <Link to="/Schedule" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">SCHEDULE</Link>
            <Link to="/Notes" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">NOTE</Link>
            <Link to="/Profile" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">PROFILE</Link>
            <Link to="/Main" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">MAIN</Link>
          </div>
      
          <div className="mt-6">
            <h2 className="text-xl mb-2">CREATE TASK</h2>
            <form className="mb-4">
              <input
                className="block w-full mb-2 p-2 text-black rounded"
                placeholder="Title" />
              <textarea
                className="block w-full mb-2 p-2 text-black rounded"
                placeholder="Objective"/>

              <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Add Note</button>
            </form>
            
          </div>
      

      </>
        
        
        
        
        
        
        
        
        
        
        
        
        /* USER IS NOT*/
        :
      <>
        <h3>{message}</h3>
        <h3>Login Now</h3>
        <Link to = "/login" className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</Link>
      </>
    }
    </div>
  </>
  )
}

export default Main