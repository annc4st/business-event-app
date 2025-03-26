import DataTable from "react-data-table-component";
import { format } from 'date-fns';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { getEvents, deleteEvent } from "../api";
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const AdminEvents = () => {
  const { user } = useAuthContext();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedEvent, setSelectedEvent] = useState("");

  const formatStartTime = (isoDate) => {
    return format(new Date(isoDate), 'yyyy-MM-dd HH:mm');
};


  useEffect(() => {
      const fetchEvents  = async () => {
          try {
              setIsLoading(true);
              // Fetch events ALL
              const events = await getEvents();
              setEvents(events);
              setIsLoading(false);
        } catch (err) {
            console.error('Error fetching events data:', err);
          setError({ message: err.message, status: err.status });
          setIsLoading(false);
        }
    }

    fetchEvents();  
}, []); 

  const handleDeleteEvent = async (event_id) => {
    if (user.username === "admin"){
    try {
      const result = await deleteEvent(event_id);
     
    } catch (error) {
        console.log(error);
      console.error("Error deleting event:", error.message);
      alert(error.message);
    }
}
  };

  if (isLoading) return <div className="loading-container">
      <div className="loader"></div>
      </div> ;

    if (!isLoading && events.length === 0) {
        return <div>No events found.</div>;
    }

const columns = [
    {
        name: "ID",
        selector: (row) => row.event_id,
        width: "10%",
        sortable: true
    },
    {
        name: "Event title",
        selector: (row) => row.event_name,
        width: "40%",
        sortable: true
    },
    {
        name: "Date",
        selector: (row) => formatStartTime(row.start_t),
        width: "40%",
        sortable: true
    },
    // delete button
    {
        cell: row => (
          <IconButton
            aria-label="delete"
            color="black"
            onClick={() => handleDeleteEvent(row.event_id)}
          >  
            <DeleteIcon />
          </IconButton>
        ),
        width: "10%",
      }
];

const customStyles = {
    headCells: {
      style: {
        FontFace: 'MPLUS1p-Regular',
        fontSize: '18px', // Customize font size for headers
        fontWeight: 'bold',
        color: '#ffa500', //  orange header text
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f5f5f5', // Light grey background for header row
      },
    },
    rows: {
      style: {
        FontFace: 'MPLUS1p-Regular',
        fontSize: '18px',
        color: '#333',
      },
      highlightOnHoverStyle: {
        backgroundColor: '#f1f1f1', // Hover effect
        cursor: 'pointer',
      },
    },
    pagination: {
      style: {
        fontSize: '18px',
        color: '#ffa500', // orange pagination
      },
    },
  };


  return (
    
    <div className="">
        <h2>Events</h2>
        <div className="">

        <DataTable 
            columns={columns} 
            data = {events || []}
            fixedHeader
            pagination
            customStyles={customStyles}
        />

        </div>
    </div>

  )

};


export default AdminEvents;
