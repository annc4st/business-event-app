import React, { useState, useContext} from "react";
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import {useLogin}  from '../hooks/useLogin'


const Login = () => {
 
  const [ password, setPassword ] = useState('')
  const [ username, setUsername] = useState('')
  const { login, isLoading, error } = useLogin()
   
  const navigate = useNavigate();


  const handleLogin = async(e) => {
    e.preventDefault();
    try {
    await login(username, password );
     navigate('/');
    } catch (error){
      console.log("Login failed:", error.message);
    }
  }

  return (
    <div className="container">
       <div className="form-wrapper">
      <h1>Login</h1>
      
      <form onSubmit={handleLogin} >
        <input

          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name="username"
          id="username"
          value={username}
          placeholder="Enter your username"
          required
        />

        <input
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
