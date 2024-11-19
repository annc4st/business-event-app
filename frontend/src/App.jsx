import React, { useState, useContext } from "react";
import {Route, Routes, Link} from "react-router-dom";
// import {UserProvider } from "./contexts/UserContext";

import EventsList from "./components/EventsList";
import ViewEvent from "./components/ViewEvent";
import Header from "./components/Header";

import Profile from "./components/Profile";
import LocationsList from "./components/LocationsList";
import CreateEvent from './components/CreateEvent';
import CreateLocation from "./components/CreateLocation";
import NotFound from "./components/errors/NotFound";
import Login from "./components/Login";
import Hero from './components/Hero';
import Signup from "./components/Signup";


function App() {
  return (
    <>
      {/* <UserProvider> */}
        <Header />
        <Hero />
        
        
          <Routes>
            <Route path = "/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/" element={<EventsList />} />
            <Route path="/:category" element={<EventsList />} />
            <Route path="/events/:event_id" element={<ViewEvent />} />
            <Route path="/my-profile" element={<Profile />} />
            <Route path ="/locations" element={<LocationsList />}/>
            <Route path="/create-location" element={<CreateLocation />} /> 
            <Route path="/create-event" element={<CreateEvent />} />
            <Route component={NotFound} />
 
          </Routes>
    
      {/* </UserProvider> */}
    </>
  );
}

export default App;
