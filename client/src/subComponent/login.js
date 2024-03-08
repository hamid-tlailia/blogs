import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../App.css'
const Login = () => {
  const [login , setLogin] = useState({
    email : '',
    password : ''
  })

  // change document title

useEffect(() => {
  // Set the initial tab title when the component mounts
  document.title = 'Login';

});
const navigate = useNavigate()
  const [response , setResponse] = useState('')
  const handleLogin = async(e) => {
    e.preventDefault()
    const  btn = e.target.btn 
    btn.disabled = true
    btn.innerHTML = `<div class="spinner-border spinner-border-sm" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`
    
try {
await axios.post("http://localhost:3002/login" , login)
.then(res => {
  setResponse(res.data.message)
  if(res.data.message === 'redirect'){
    const newData = res.data.infos
    const toLocal = {
      'id' :newData._id ,
      'firstname' : newData.firstname,
      'lastname' : newData.lastname,
      'email' : newData.email,
      'isloging' : true
    }
    localStorage.setItem('user' , JSON.stringify(toLocal))
    navigate('/dashboard')
    window.location.reload()
  }else{
    btn.disabled = false
     btn.innerHTML = 'Sign in'
    }
})

}catch(error){
  console.log(error)
}
  }


  return (
    <div className='w-75 p-2 mt-3'>
          {
  response === "" || response === "redirect" ? <span></span> : <div className="alert alert-danger ">{response} </div>

}
      <form onSubmit={handleLogin}>
  <div data-mdb-input-init class="form-floating mb-4">
    <input type="email" id="form1Example1" onChange={(e) => {
      setLogin({...login , email : e.target.value})
    }} class="form-control" required/>
    <label class="form-label" for="form1Example1">Email address</label>
  </div>

  <div data-mdb-input-init class="form-floating mb-4">
    <input type="password" id="form1Example2" onChange={(e) => {
      setLogin({...login , password : e.target.value})
    }} class="form-control" required />
    <label class="form-label" for="form1Example2">Password</label>
  </div>

  <button data-mdb-ripple-init id='btn' type="submit" style={{width : '130px' , height : '35px'}} class="btn btn-primary ">sing in</button>
</form>
    </div>
  );
}

export default Login;
