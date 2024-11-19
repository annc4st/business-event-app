import React, {useState} from 'react'
import { useSignup } from '../hooks/useSignup'
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const [email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ username, setUsername] = useState('')
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async(e) => {
        e.preventDefault();
       try{
            await signup(username, password, email);
            navigate('/');
       } catch (error) {
            console.error('Error registering user:', error);
       }
    }

    
    return (
        <div className="container">
           <div className="form-wrapper">
           <h1>Register</h1>
           {error && <p style={{color:'red'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="username" type="text" 
                onChange={(e) => setUsername(e.target.value)} value = {username}
                placeholder="Username" required />
          <input name="password" type="password" 
                onChange={(e) => setPassword(e.target.value)} value={password}
                placeholder="Password" required />
          <input name="email" type="email" 
                onChange={(e) => setEmail(e.target.value)} value = {email}
                placeholder="Email" required />
          <button type="submit" disabled={isLoading}>Register</button>
          {error && <p style={{color:'red'}}>{error}</p>}
        </form>
        </div>
        </div>
      );
}

export default Signup
