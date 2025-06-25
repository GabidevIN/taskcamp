import React, { useState, useEffect } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [pass, passID] = useState("");
  const [name, nameID] = useState("");
  const [message, setMessage] = useState("");

  // FETCH FOR DATA
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if user exists with matching name and password
    const foundUser = users.find(
      users => users.name === name && users.pass === pass
    );

    if (foundUser) {
      setMessage("Login successful!");
    } else {
      setMessage("Invalid username or password");

    // to shwo message 
      {/*   setTimeout(() => {
        setMessage("Invalid username or password");
      }, 5000);*/}
    }
  };

  return (
    <>
      <h1>LOGIN SYSTEM</h1>
      <form onSubmit={handleSubmit}>
        <input value={name} placeholder="USERNAME" onChange={(e) => nameID(e.target.value)} />
        <input type="password" value={pass} placeholder="PASSWORD"  onChange={(e) => passID(e.target.value)} />

        <button type="submit">ENTER</button>
      </form>
      <p>{message}</p>
    </>
  );
}

export default Users;
