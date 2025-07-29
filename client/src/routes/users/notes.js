import { useState, useEffect, useRef } from 'react';
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
  const fetched = useRef(false)

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
          setMessage(res.data.Error || 'Session expired, please log in.');
        }
      })
      .catch(() => {
        setAuth(false);
        setMessage('Failed to verify session. Please log in.');
      });
  }, []);

// ----- FETCH NOTES
useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchNotes = async () => {
      try {
        const res = await axios.get('http://localhost:8081/notes', { withCredentials: true });
        console.log("📥 Notes fetched:", res.data);
        if (Array.isArray(res.data)) {
          setNotes(res.data);
        } else {
          console.warn("Unexpected response:", res.data);
          setNotes([]);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, []);

// ----- Noting System
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const res = await axios.post('http://localhost:8081/notes', { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prev => [...prev, res.data]);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

// ----- Deleting Notes



// ----- LOGOUT SESSION
  const logout = () => {
    axios.get('http://localhost:8081/logout')
      .then(() => {
        localStorage.removeItem('token');
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#948997] to-[#393e3e] text-white p-4 rounded">
      {auth ? (
        <>
          <h3 className="text-center text-2xl mb-4">Welcome, {name}!</h3>
          <div className="flex gap-2 mb-4">
            <Link to="/" onClick={logout} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">LOGOUT</Link>
            <Link to="/Schedule" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">SCHEDULE</Link>
            <Link to="/Main" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">MAIN</Link>
            <Link to="/Profile" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">PROFILE</Link>
            <Link to="/CreateTask" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">CREATE TASK</Link>
          </div>

          <div className="mt-6">
            <h2 className="text-xl mb-2">Your Notes</h2>
            <form onSubmit={handleAddNote} className="mb-4">
              <input
                className="block w-full mb-2 p-2 text-black rounded"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <textarea
                className="block w-full mb-2 p-2 text-black rounded"
                placeholder="Content"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Add Note</button>
            </form>

            {notes.length > 0 ? ( // Display notes
              [...notes]
                .sort((a, b) => b.id - a.id)
                .map(note => (
                  <div key={note.id} className="mb-4 p-3 bg-gray-800 rounded">
                    <h3 className="font-bold">{note.title}</h3>
                    <p>{note.content}</p>
                  </div>
                ))

            ) : (
              <p>No notes found. Create one above!</p>

            )}


          </div>
        </>
      ) : (
        <>
          <h3 className="text-center text-lg">{message}</h3>
          <h3 className="text-center">Login Now</h3>
          <Link to="/login" className="block text-center bg-green-600 text-white px-6 py-2 mt-4 w-full rounded hover:bg-green-700">LOGIN</Link>
        </>
      )}
    </div>
  );
}

export default Main;
