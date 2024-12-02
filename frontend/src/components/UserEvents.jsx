import React, { useEffect, useState } from "react";
import { getUserSignedUpEvents, removeGuest } from "../api";

const UserEvents = ({ user }) => {
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
        .catch((error) => {
          if (error.response?.status === 404) {
            setError("User has not signed up for any events."); // Custom error message for 404 case
          } else {
            setError("Failed to fetch events. Please try again later.");
          }
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

  //Cancel participation
  const cancelParticipation = (eventId, event_name) => {
    if (
      window.confirm(
        `Are you sure you want to cancel in event ${event_name} $ ?`
      )
    ) {
      removeGuest(eventId, user.userID, user.token)
        .then(() => {
          window.alert(`Your participation in event ${eventId} was removed!`);
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.event_id !== eventId)
          );
        })
        .catch((error) => {
          console.error("Failed to cancel participation:", error);
          alert("Failed to cancel participation. Please try again later.");
        });
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-signedup-event">
      <h3>You Signed Up For the Following Events</h3>
      <ol>
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.event_id}>
              <div className="user-signedup-event-details">
                <h4 onClick={() => toggleEventDetails(event.event_id)}>
                  {event.event_name}
                </h4>
                {expandedEventId === event.event_id && (
                  <div className="event-details">
                    <p>{event.description}</p>
                    <p>
                      Start Time:{" "}
                      {event.start_t
                        ? new Date(event.start_t).toLocaleString()
                        : "N/A"}
                    </p>
                    <p>
                      End Time:{" "}
                      {event.end_t
                        ? new Date(event.end_t).toLocaleString()
                        : "N/A"}
                    </p>
                    <button
                      onClick={() =>
                        cancelParticipation(event.event_id, event.event_name)
                      }
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No signed-up events found.</p>
        )}
      </ol>
    </div>
  );
};
export default UserEvents;
