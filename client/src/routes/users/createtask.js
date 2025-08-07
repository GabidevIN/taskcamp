import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';




function Main() {
// ----- SESSION SYSTEM
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [objective, setObjective] = useState('');  
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [task, setTask] = useState([]);
  const fetched = useRef(false);






// ----- SESSION SYSTEM
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:8081')
      .then(res => {
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
          setMessage(res.data.Error || 'Session expired, please log in.');
        }
      })
      .catch(() => {
        setAuth(false);
        setMessage('Failed to verify session. Please log in.');
      });
  }, []);

// ----- LOGOUT SESSION
  const logout = () => {
    axios.get('http://localhost:8081/logout')
    .then(res => {
      window.location.reload(true);
    }).catch(err => console.log(err));
  }

// ----- FETCH NOTES
const fetchNotes = async () => {
  try {
    const res = await axios.get('http://localhost:8081/createtask', { withCredentials: true });
    console.log("📥 Notes fetched:", res.data);
    if (Array.isArray(res.data)) {
      setTask(res.data);
    } else {
      console.warn("Unexpected response:", res.data);
      setTask([]);
    }
  } catch (err) {
    console.error("Error fetching notes:", err);
  }
};
useEffect(() => {
  if (fetched.current) return;
  fetched.current = true;
  fetchNotes();
}, []);

// ----- Tasking System
const handleCreateTask = async (e) => {
  e.preventDefault();
  if (!title.trim() || !objective.trim()) return;

  try {
    await axios.post('http://localhost:8081/createtask', 
      { title, objective, time, date }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchNotes();
    setTitle('');
    setObjective('');
    setTime('');
    setDate('');
  } catch (err) {
    console.error("Error adding Task:", err);
  }
};

// ----- Deleting task
const deleteTask = async (id) => {
  try {
    const res = await axios.delete(`http://localhost:8081/createtask/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data.Status === "DeletedTask") {
      setTask(prev => prev.filter(task => task.id !== id));      
    } else {
      console.warn(res.data.Status);
    }
  } catch (err) {
    console.error("Error deleting Task:", err);
  }
};

// ----- Complete Task
const CompleteTask = async (id) => {
  try {
    const res = await axios.patch(`http://localhost:8081/createtask/${id}`, 
      {}, // optional body (not used in backend, so can be empty)
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.Status === "CompletedTask") {
      setTask(prev => 
        prev.map(task => 
          task.id === id ? { ...task, completed: 1, ongoing: 0 } : task
        )
      );
    } else {
      console.warn(res.data.Status);
    }
  } catch (err) {
    console.error("Error completing Task:", err);
  }
};

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
            <h2 className="text-xl mb-2">Your TASK</h2>
            <form onSubmit={handleCreateTask} className="mb-4">
              <input className="block w-full mb-2 p-2 text-black rounded"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="p-2 rounded text-black"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-2 rounded text-black ml-2"
              />

              <div className="mt-4 text-white">
                <p>Selected Time: {time || "None"}</p>
                <p>Selected Date: {date || "None"}</p>
              </div>

              <textarea
                className="block w-full mb-2 p-2 text-black rounded"
                placeholder="objective"
                value={objective}
                onChange={e => setObjective(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Add Task</button>
            </form>
            
          </div>
      
          <div> {/*DISPLAY OF TASK*/} 
            <h2>ON GOING TASK</h2>
            {task.length > 0 ? (
              [...task]
                .filter(task => task.ongoing === 1 && task.completed === 0)


                .sort((a, b) => b.id - a.id)
                .map(task => {
                  const formattedDate = task.date ? task.date.split('T')[0] : '';
                  const formattedTime = task.time ? task.time.slice(0, 5) : '';

                  return (
                    <div key={task.id} className="mb-4 p-3 bg-gray-800 rounded cursor-pointer"
                      onClick={() => alert(`Note ID: ${task.id}`)}>
                      <h3 className="font-bold">{task.title}</h3>
                      <p>{task.objective}</p>
                      <p>{formattedTime}</p>
                      <p>{formattedDate}</p>
                      <p>Ongoing</p>
                      <button onClick={() => deleteTask(task.id)}>Delete Task</button>
                      <button onClick={() => CompleteTask(task.id)}>Complete Task</button>
                    </div>
                  );
                })

            ) : (
              <p>No Task found. Create one above!</p>
            )}
          </div>

          <div> {/*DISPLAY OF LATE TASK*/}
            <h2>LATE TASK</h2>
            {task.length > 0 ? (
              [...task]
                .filter(task => task.ongoing === 0 && task.completed === 0)


                .sort((a, b) => b.id - a.id)
                .map(task => {
                  const formattedDate = task.date ? task.date.split('T')[0] : '';
                  const formattedTime = task.time ? task.time.slice(0, 5) : '';

                  return (
                    <div key={task.id} className="mb-4 p-3 bg-gray-800 rounded cursor-pointer"
                      onClick={() => alert(`Note ID: ${task.id}`)}>
                      <h3 className="font-bold">{task.title}</h3>
                      <p>{task.objective}</p>
                      <p>{formattedTime}</p>
                      <p>{formattedDate}</p>
                      <p>Delayed</p>
                      <button onClick={() => deleteTask(task.id)}>Delete Task</button>
                      <button onClick={() => CompleteTask(task.id)}>Complete Task</button>
                    </div>
                  );
                })
            ) : (
              <p>No Task found. Create one above!</p>
            )}
          </div>

          <div> {/*DISPLAY OF COMPLETED*/}
            <h2>Completed Task</h2>
            {task.length > 0 ? (
              [...task]
                .filter(task => task.completed === 1 && task.ongoing === 1)
                .sort((a, b) => b.id - a.id)
                .map(task => {
                  const formattedDate = task.date ? task.date.split('T')[0] : '';
                  const formattedTime = task.time ? task.time.slice(0, 5) : '';

                  return (
                    <div key={task.id} className="mb-4 p-3 bg-gray-800 rounded cursor-pointer"
                      onClick={() => alert(`Note ID: ${task.id}`)}>
                      <h3 className="font-bold">{task.title}</h3>
                      <p>{task.objective}</p>
                      <p>{formattedTime}</p>
                      <p>{formattedDate}</p>
                      <p>Completed</p>
                      <button onClick={() => deleteTask(task.id)}>Hide Task</button>
                    </div>
                  );
                })
            ) : (
              <p>No Task found. Create one above!</p>
            )}
          </div>

          <div> {/*Late Completed*/}
            <h2>delayed Completed Task</h2>
            {task.length > 0 ? (
              [...task]
                .filter(task => task.ongoing === 0 &&task.completed === 1)
                .sort((a, b) => b.id - a.id)
                .map(task => {
                  const formattedDate = task.date ? task.date.split('T')[0] : '';
                  const formattedTime = task.time ? task.time.slice(0, 5) : '';


                  return (
                    <div key={task.id} className="mb-4 p-3 bg-gray-800 rounded cursor-pointer"
                      onClick={() => alert(`Note ID: ${task.id}`)}>
                      <h3 className="font-bold">{task.title}</h3>
                      <p>{task.objective}</p>
                      <p>{formattedTime}</p>
                      <p>{formattedDate}</p>
                      <p>Delayed</p>
                      <button onClick={() => deleteTask(task.id)}>Hide Task</button>
                    </div>
                  );
                })
            ) : (
              <p>No Task found. Create one above!</p>
            )}
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