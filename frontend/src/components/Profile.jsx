import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import "./errors/errors.css";
import UserEvents from "./UserEvents";

import FileUpload from "./FileUpload";

const Profile = () => {
  const { user } = useAuthContext();

  console.log("Wprint user role>> ",  user);

  return (
    <div className="profile-page">
      {user && (
        <>
          <h2>{user.username}'s Profile</h2>
          <UserEvents user={user} />
        </>
      )}

      {user && user.role === "admin" && (
        <div className="admin-section">
          <p>If user is admin you can see this</p>
          <p>
            <Link to={"/create-event"}>Create new event</Link>
          </p>
        </div>
      )}

      {/* <FileUpload /> */}

    </div>
  );
};

export default Profile;
