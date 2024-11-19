/* 

import React, { useState } from 'react';
import { registerUser } from '../api';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Register = () => {
  

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user',
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    try {
      const response = await registerUser(formData);
      navigate('/login')
    } catch (error) {
      console.error('Error registering user:', error);
      setError(error.message)
    }
  };

  return (
    <div className="container">
       <div className="form-wrapper">
       <h1>Register</h1>
       {error && <p style={{color:'red'}}>{error}</p>}
    <form onSubmit={handleSubmit}>
      <input name="username" type="text" onChange={handleChange} placeholder="Username" required />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
      <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
      <button type="submit">Register</button>
    </form>
    </div>
    </div>
  );
};

export default Register;
*/
