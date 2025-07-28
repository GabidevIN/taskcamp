import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Main() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(false);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  axios.defaults.withCredentials = true;

// ----- SESSION SYSTEM
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
          setMessage(res.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []);

// ----- fecthing notes
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:8081/notes', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setNotes(res.data))
        .catch(err => console.log(err));
    }
  }, [token]);

// ----- System displays
  const handleAddNote = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/notes', { title, content }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setNotes(prev => [...prev, res.data]);
      setTitle('');
      setContent('');
    }).catch(err => console.log(err));
  };

// ----- deleting system



// ----- editing system




// ----- logout function
  const logout = () => {
    axios.get('http://localhost:8081/logout')
      .then(() => {
        localStorage.removeItem('token');
        window.location.reload(true);
      }).catch(err => console.log(err));
  };




  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#948997] to-[#393e3e] text-white p-4 rounded">
      {auth ? (
        <>
          <h3 className="text-center text-2xl mb-4">Welcome, {name}!</h3>
          <Link to="/" onClick={logout} className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGOUT</Link>
          <Link to="/Schedule">SCHEDULE</Link>
          <Link to="/Main">MAIN</Link>
          <Link to="/Profile">PROFILE</Link>
          <Link to="/CreateTask">CREATE TASK</Link>

          <div className="mt-6">
            <h2 className="text-xl mb-2">Your Notes</h2>
            <form onSubmit={handleAddNote} className="mb-4">
              <input className="block w-full mb-2 text-black" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <textarea className="block w-full mb-2 text-black" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
              <button type="submit" className="bg-blue-600 px-4 py-2">Add Note</button>
            </form>

            {notes.map(note => (
              <div key={note.id} className="mb-4 p-2 bg-gray-800 rounded">
                <h3 className="font-bold">{note.title}</h3>
                <p>{note.content}</p>
              </div>
            ))}

          </div>
        </>
      ) : (
        <>
          <h3>{message}</h3>
          <h3>Login Now</h3>
          <Link to="/login" className="block text-center bg-green-600 text-white px-6 py-2 w-full rounded-none hover:bg-green-700">LOGIN</Link>
        </>
      )}
    </div>
  );
}

export default Main;
