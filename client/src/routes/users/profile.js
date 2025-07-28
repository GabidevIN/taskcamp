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
  const [delay, setDelay] = useState('');
  const [completed, setCompleted] = useState('');
  const [late, setlate] = useState('');
  const [shared, setShared] = useState('');
  const [id, setId] = useState('');





  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:8081')
    .then(res => {
      console.log(res.data);
      if (res.data.Status === "Success") {
        setName(res.data.name);
        setStatus(res.data.admin);
        setDelay(res.data.delay);
        setCompleted(res.data.completed);
        setlate(res.data.late);
        setShared(res.data.shared);
        setId(res.data.id);

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
        <Link to ="/" onClick={logout} className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGOUT</Link>
        <h1>Delayed: {delay} </h1>
        <h1>Completed: {completed} </h1>
        <h1>Late: {late} </h1>
        <h1>Shared: {shared} </h1>
        
        
        
        <Link to ="/schedule" >SCHEDULE</Link>
        <Link to ="/notes" >NOTES</Link>
        <Link to ="/main" >MAIN</Link>
        <Link to ="/createTask" >CREATE TASK</Link>  
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