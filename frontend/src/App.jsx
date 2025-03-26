import React, { useState, useContext } from "react";
import { Route, Routes} from "react-router-dom";

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
import AdminEvents from "./components/AdminEvents";
import AdminRoute from "./components/AdminRoute";


function App() {

  return (
    <>
      <Header />
        <Hero />
          <Routes>
            <Route path ="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/" element={<EventsList />} />
            <Route path="/:category" element={<EventsList />} />
            <Route path="/events/:event_id" element={<ViewEvent />} />
            <Route path="/my-profile" element={<Profile />} />
            <Route path ="/locations" element={<LocationsList />}/>
            <Route path="/create-location" element={<AdminRoute><CreateLocation /></AdminRoute>} /> 
            <Route path="/create-event" element={<AdminRoute><CreateEvent /></AdminRoute>} />
            <Route path="/admin" element={ <AdminRoute><AdminEvents /> </AdminRoute>} />
            <Route component={NotFound} />
 
          </Routes>      
    </>
  );
}

export default App;
