import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Home</h1>
      <button className="home-button" onClick={goToLogin}>
        Go to Login
      </button>
    </div>
  );
}

export default Home;
