import React from 'react';
import './connectivity.css'
const Connectivity = () => {
  return (
    <div>
       <div class="container">
    <h1>No Internet Connection</h1>
    <p>Please check your internet connection and try again.</p>
    <button onclick="window.location.reload()">Retry</button>
  </div>
    </div>
  );
}

export default Connectivity;
