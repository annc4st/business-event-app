import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import "./errors/errors.css";
import UserEvents from "./UserEvents";

import FileUpload from "./FileUpload";

const Profile = () => {
  const { user } = useAuthContext();

  return (
    <div className="profile-page">
      {user && (
        <>
          <h2>Hi, {user.username}!</h2>
          <UserEvents user={user} />
        </>
      )}

      {user && user.username === "admin" && (
        <div className="admin-section">
          <p><Link to={"/admin"}>Manage events </Link></p>
          <p><Link to={"/create-event"}>Create new event</Link></p>
          <p><Link to={"/create-location"}>Create location</Link></p>
        </div>
      )}

    </div>
  );
};

export default Profile;
