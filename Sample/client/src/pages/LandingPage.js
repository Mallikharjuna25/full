import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <h1>Welcome to Prajwalan Event Management</h1>
      <p>Manage your college events seamlessly</p>
      <Link to="/login"><button style={{ margin: '1rem' }}>Login</button></Link>
      <Link to="/signup"><button style={{ margin: '1rem' }}>Signup</button></Link>
    </div>
  );
};

export default LandingPage;
