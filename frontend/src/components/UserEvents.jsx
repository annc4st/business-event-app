import React, { useEffect, useState } from 'react';
import { getUserSignedUpEvents } from '../api';
 


const UserEvents = ({user}) => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [expandedEventId, setExpandedEventId] = useState(null);
    const [loading, setLoading] = useState(true);
     

    useEffect(() => {
        if (user?.token) {
            getUserSignedUpEvents(user.token)
            .then((eventsData) => {
                setEvents(eventsData); // Set the events data to state
          setLoading(false);
            })
           .catch ((error) => {
            setError("Failed to fetch events. Please try again later.");
           setLoading(false);
            });
        } else {
            setError("User token is missing. Please log in.");
            setLoading(false);
          }
        }, [user?.token]); 

    const toggleEventDetails = (eventId) => {
        setExpandedEventId(expandedEventId === eventId ? null : eventId);
    };
    if (loading) return <p>Loading events...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='user-signedup-event'>
            <h3>You Signed Up For the Following Events</h3>
            <ol>
                {events.length > 0 ? (
                    events.map((event) => (
                    <li key={event.event_id}>
                        <div className='user-signedup-event-details'>
                            <h4 onClick={() => toggleEventDetails(event.event_id)}>{event.event_name}</h4>
                            {expandedEventId === event.event_id && (
                                <div className="event-details">
                                    <p>{event.description}</p>
                                    {/* <p>Start Time: {new Date(event.start_t).toLocaleString()}</p>
                                    <p>End Time: {new Date(event.end_t).toLocaleString()}</p> */}

                                    <p>Start Time: {event.start_t ? new Date(event.start_t).toLocaleString() : 'N/A'}</p>
                                        <p>End Time: {event.end_t ? new Date(event.end_t).toLocaleString() : 'N/A'}</p>
                                </div>
                            )}
                        </div>
                    </li>
                ))
                ): (
                    <p>No signed-up events found.</p>
                )}
            </ol>
        </div>
    );
};
export default UserEvents;