import React, { useState , useEffect } from 'react';
import axios from 'axios'
const Create = () => {

  const [article , setArticle] = useState ({
    title : '',
    body : ''
  })

  const [Message , setMessage] = useState ("")
// change document title

useEffect(() => {
  // Set the initial tab title when the component mounts
  document.title = 'Create/blog';

});
  const handleLogin = async(e) => {

    e.preventDefault()

 await axios.post('http://localhost:3002' , article).then(res => setMessage(res.data.message))
    e.target.reset()
  }

  return (
    <div className=' mt-3 p-3 border border-dark w-75'>
<form style={{width : '100%'}} onSubmit={handleLogin}>
  <div data-mdb-input-init class="form-floating mb-4">
    <input type="text" id="titleid" class="form-control" onChange={(e) => {
      setArticle({...article , title : e.target.value})
    }} required/>
    <label class="form-label" for="form4Example1">Blog-title</label>
  </div>

  <div data-mdb-input-init class="form-floating mb-4">
    <textarea class="form-control" id="form4Example3" rows="4" onChange={(e) => {
      setArticle({...article , body : e.target.value})
    }} required></textarea>
    <label class="form-label" for="form4Example3">Blog-body</label>
  </div>


  <button data-mdb-ripple-init type="post" id='btn' class="btn btn-primary  mb-4">Create</button>
</form>   
{
   Message === "Article successfuly created !" ? <div className="alert alert-success ">{Message}</div> : <span></span>

}

{
   Message === "Article already exists" ? <div className="alert alert-danger ">{Message}</div> : <span></span>
}

 </div>
  );
}

export default Create;
