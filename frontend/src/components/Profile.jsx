import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import "./errors/errors.css";
import UserEvents from "./UserEvents";

import FileUpload from "./FileUpload";

const Profile = () => {
  const { user } = useAuthContext();

  console.log("Print user >> ",  user);

  return (
    <div className="profile-page">
      {user && (
        <>
          <h2>{user.username}'s Profile</h2>
          <UserEvents user={user} />
        </>
      )}

      {user && user.username === "admin" && (
        <div className="admin-section">
          <p><Link to={"/admin"}>Manage events </Link>
          </p>
          <p>
            <Link to={"/create-event"}>Create new event</Link>
          </p>
          <div className="events-table">

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
