import {Route, Routes, Link} from "react-router-dom";
 
import '../index.css'

const EventItem = ({event}) => {
return (
    <div className="event-item">
        <Link to={`/events/${event.event_id}`}>
        <p className="event-item-det-t">Event Title</p>
        <div className="eventcard-title">
        <h3>{event.event_name}</h3></div>
        </Link>
        <div className="event-item-pic">
            <img src={event.image_url} />
        </div>
        <p className="event-item-det-t">Description</p>
        <p className="event-item-det">{event.description}</p>
        <p className="event-item-det-t">Event is happening:</p>
        <p className="event-item-det">{new Date(event.start_t).toLocaleString()}</p>

        <p className="event-item-det-t">Location</p>
        <p className="event-item-det locat"> {event.first_line_address}, {event.second_line_address}, {event.city}, {event.postcode}</p>
    </div>
)

}

export default EventItem;
