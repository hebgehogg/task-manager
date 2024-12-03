import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/authSlice';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(
        loginSuccess({
          isAdmin: true,
          token,
        })
      );
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
