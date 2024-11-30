import React, { useState, useContext } from "react";
import { useAuthContext } from '../hooks/useAuthContext'
import { Link, useNavigate } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";

import "./Header.css";

const Header = () => {

  const navigate = useNavigate();
  const { user } = useAuthContext();


  return (
    <header className="header">
      <input className="menu-btn" type="checkbox" id="menu-btn" />
      <label className="menu-icon" htmlFor="menu-btn">
        <span className="navicon"></span>
      </label>
      <div className="menu">
 
      <Link to="/">All Events</Link>{' '}
      {user && (
        <div>
        <Link to="/my-profile">My Profile</Link>{' '}
        </div>
      )}
        <Link to="/create-event">Create Event</Link>{' '}
      </div>


      {user && (
        <div className="header-greet">
          <div className="logged-user">
            <p>Welcome, {user.username}!</p>
          </div>
          <LogoutBtn />
        </div>
      )}

      {!user && (

        <div className="header-greet">
          <div className="logged-user">
            <p>Welcome, Stranger!</p>
            <Link to={'/login'}><button>Login</button></Link>
          </div>
          <div className="logged-user">
           
            <Link to={'/register'}><button>Register</button></Link>          
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
