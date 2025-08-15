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
const deleteNotes = async (id) => {
  try {
    const res = await axios.delete(`http://localhost:8081/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data.Status === "Deleted") {
      setNotes(prev => prev.filter(note => note.id !== id));      
    } else {
      console.warn(res.data.Status);
    }
  } catch (err) {
    console.error("Error deleting note:", err);
  }
};


// ----- LOGOUT SESSION
  const logout = () => {
    axios.get('http://localhost:8081/logout')
      .then(() => {
        localStorage.removeItem('token');
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      {auth ? (
        <>
{/*----- NAVBAR -----*/}
        <div className="bg-gray-800 p-4 h-screen w-64 fixed left-0 top-0 z-10 drop-shadow-lg">
          <nav className="flex flex-col flex-grow gap-5 justify-center items-center h-full p-4">
            <Link to="/main" className="bg-gray-700 text-center w-32 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
            HOME</Link>
            
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
        <div className="w-screen bg-gray-800 h-14 z-5 fixed flex justify-center items-center shadow-md">
            <Link to="/" onClick={logout} className="bg-green-400 text-center w-32 text-white px-4 py-2 rounded hover:bg-red-400 transition">
            LOGOUT</Link>
        </div>
{/* ----- NOTING CONTAINER ----- */}
<div className="flex items-center justify-center h-screen gap-20 w-[1500px] mx-auto p-6 mr-20">
  
  {/* ----- NOTING SECTION ----- */}

  <div className="bg-gray-800 h-[800px] w-[500px] p-4 rounded shadow-lg rounded-[25px]">

    <h2 className="text-xl mb-2 text-center text-white">Your Notes</h2>
    <form onSubmit={handleAddNote} className="mb-4">
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
        className="block w-full mb-2 p-2 text-black rounded"/>

      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}
        className="block w-full  mb-2 p-2 text-black rounded resize-none h-[600px]"/>

      <button type="submit"
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
        Add Note </button>
  
    </form>
  </div>


{/* ----- FETCH SECTION ----- */}
  <div className="flex flex-col bg-gray-800 items-center overflow-y-auto h-[800px] w-[700px] rounded-[25px] scrollbar-hide">
    {notes.length > 0 ? (
      [...notes]
        .sort((a, b) => b.id - a.id)
        .map((note) => (
          <div
            key={note.id}
            className="mb-4 p-3 bg-white-800 rounded w-full text-white shadow cursor-pointer"
            onClick={() => alert(`Note ID: ${note.id}`)}
          >
            <h3 className="font-bold">{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={(e) => { e.stopPropagation(); deleteNotes(note.id); }}
              className="mt-2 bg-red-600 px-3 py-1 rounded hover:bg-red-700" >
              Delete </button>
          </div>
        ))
    ) : (
      <p className="text-gray-500">No notes found. Create one above!</p>
    )}
  </div>
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
