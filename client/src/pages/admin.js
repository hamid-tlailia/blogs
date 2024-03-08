
import '../App.css';
import { NavLink , Outlet} from 'react-router-dom';
const Admin = () => {

  return (
    <div className='card m-3 bg-transparent'>
          <div className="card-header"><h3 className='card-title text-center text-decoration-underline'>
            Welcome to admin dashboard , please sign in
            </h3></div>
    <div className="card-body d-flex flex-column">
<div className="header-btns w-100 shadow-1 d-flex flex-row justify-content-center">
  <NavLink  className="btn btn-outline-info rounded-0 me-3" to='login'>Login</NavLink>
  <NavLink className="btn btn-outline-warning rounded-0" to='register'>Register</NavLink>
</div>

      <div className="btns-result">
<Outlet/>
    </div>
  

    </div>
    <div className="card-footer"></div>
    </div>
  );
}

export default Admin;
