import React, {useState, useEffect} from 'react'

function Main() {
// USER INPUT 
const [User, Setuser] = useState("");
const [Pass, SetPass] = useState("");
const [result, Setresult] = useState("")
// USER INPUT 

const testing =() =>{
  const testt = SetPass(Pass) + Setuser(User)
  Setresult(testt)
}




  return (
    // ----- LOGIN GUI
    <>
        <form>
            <h1>LOGIN SYSTEM</h1>
            <input value={User} placeholder='Enter Username' onChange={e => Setuser(e.target.value)}/>
            <input value={Pass} placeholder='Enter Password' onChange={e => SetPass(e.target.value)}/>
            <button onClick={testing}>LOGIN</button>
            <h1>MESSAGE:{result} </h1>
        </form>
    </>
  )
}

export default Main 