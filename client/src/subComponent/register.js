import React, { useState ,useEffect} from 'react';
import axios from 'axios'
const Register = () => {

  const [register , setRegister] = useState({
    firstname : '',
    lastname : '',
    email : '',
    password : ''
  })
const [response , setResponse] = useState('')

// change document title

useEffect(() => {
  // Set the initial tab title when the component mounts
  document.title = 'Register';

});
  const handleRegister = async (e) => {
    e.preventDefault()
  try{
    await axios.post('http://localhost:3002/register' , register)
    .then(res => {
      setResponse(res.data.message)
      e.target.reset()
    })
  }catch(err){
console.log(err)
  }
    
  }
  return (
    <div className='w-75 text-center p-2 mt-3'>
      {
   response === "Registred successfuly !" ?  <div className="alert alert-success ">{response } </div> : <span></span>

}

{
   response !== "Registred successfuly !" && response !=="" ? <div className="alert alert-danger ">{response}</div> : <span></span>
}
      <form onSubmit={handleRegister}>
  <div class="row  mb-4">
    <div class="col-lg-6 col-sm-12 mb-4">
      <div data-mdb-input-init class="form-floating">
        <input type="text" id="form3Example1" class="form-control" onChange={(e) => {
          setRegister({...register , firstname : e.target.value})
        }}  required/>
        <label class="form-label" for="form3Example1">First name</label>
      </div>
    </div>
    <div class="col-lg-6 col-sm-12">
      <div data-mdb-input-init class="form-floating">
        <input type="text" id="form3Example2" class="form-control"  onChange={(e) => {
          setRegister({...register , lastname : e.target.value})
        }} required/>
        <label class="form-label" for="form3Example2">Last name</label>
      </div>
    </div>
  </div>

  <div data-mdb-input-init class="form-floating mb-4">
    <input type="email" id="form3Example3" class="form-control"  onChange={(e) => {
          setRegister({...register , email : e.target.value})
        }} required/>
    <label class="form-label" for="form3Example3">Email address</label>
  </div>
  <div data-mdb-input-init class="form-floating mb-4">
    <input type="password" id="form3Example4" class="form-control"  onChange={(e) => {
          setRegister({...register , password : e.target.value})
        }} required/>
    <label class="form-label" for="form3Example4">Password</label>
  </div>

  <button data-mdb-ripple-init type="submit" class="btn btn-primary  mb-4">Sign up</button>

  <div class="text-center">
    <p>or sign up with:</p>
    <button data-mdb-ripple-init type="button" class="btn btn-secondary btn-floating mx-1">
      <i class="fab fa-facebook-f"></i>
    </button>

    <button data-mdb-ripple-init type="button" class="btn btn-secondary btn-floating mx-1">
      <i class="fab fa-google"></i>
    </button>

    <button data-mdb-ripple-init type="button" class="btn btn-secondary btn-floating mx-1">
      <i class="fab fa-twitter"></i>
    </button>

    <button data-mdb-ripple-init type="button" class="btn btn-secondary btn-floating mx-1">
      <i class="fab fa-github"></i>
    </button>
  </div>
</form>

    </div>
  );
}

export default Register;
