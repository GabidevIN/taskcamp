import React, {useState, useEffect} from 'react'

function Main() {
const [User, Setuser] = useState("");
const [Pass, SetPass] = useState("");


  return (
    <>
        <form>
            <h1>LOGIN SYSTEM</h1>
            <input value={User} placeholder='Enter Username' onChange={e => Setuser(e.target.value)}/>
            <input value={Pass} placeholder='Enter Password' onChange={e => SetPass(e.target.value)}/>
            <button>LOGIN</button>
            <h1>MESSAGE</h1>

        </form>
    </>
  )
}

export default Main 