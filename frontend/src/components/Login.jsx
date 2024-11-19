import React, { useState, useContext} from "react";
// import { UserContext } from "../contexts/UserContext";
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {useLogin}  from '../hooks/useLogin'

const Login = () => {
 
  
  const [ password, setPassword ] = useState('')
  const [ username, setUsername] = useState('')
  const { login, isLoading, error } = useLogin()
  

 
  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    await login(username, password );
     navigate('/');
  }

  return (
    <div className="container">
       <div className="form-wrapper">
      <h1>Login</h1>
      
      <form onSubmit={handleLogin} >
        <input
          // onChange={handleChange}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name="username"
          id="username"
          value={username}
          placeholder="Enter your username"
          required
        />

        <input
          // onChange={handleChange}
          name="password" type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)} 
          value={password}
          placeholder="Enter your password"
          required
        />

        <button disabled={isLoading} type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
    <div className="login-p">
    <p>If you have not registered, please <Link to={'/register'}>Register</Link>. </p>
     </div>
     </div>
  );
};

export default Login;
