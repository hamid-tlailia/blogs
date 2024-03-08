import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
  }



  render() {
    if (this.state.hasError) {
      return (
        <div className='d-flex flex-column jsutify-content-center align-items-center p-5' >
        <h2  className='mb-4'>Something went wrong <span className='fs-1'> 😔</span></h2>
        <p>We're sorry, but an error occurred. Please try again later.</p>
        <a href='/' style={{zIndex:"21474836478"}} ><button className='btn btn-outline-success'>Home</button></a>
      </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
