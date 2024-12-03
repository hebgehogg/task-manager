import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import TaskList from './TaskList';
import '../styles.css';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <header className="header">
        <span className="header-title">Task Manager</span>
        <button
          className="header-button"
          onClick={isAdmin ? handleLogout : handleLogin}
        >
          {isAdmin ? 'Logout' : 'Login'}
        </button>
      </header>
      <div className="home-container">
        <TaskList isAdmin={isAdmin} />
      </div>
    </div>
  );
}

export default Home;
