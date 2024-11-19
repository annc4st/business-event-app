import React from 'react'
import { google, outlook, office365, yahoo, ics}  from "calendar-link";

const AddToCalendar = ({ event }) => {
    const { event_name, description, start_t, end_t, first_line_address, second_line_address, city, postcode } = event;
    
    
    // Format the datetime strings
   
      const formatDateTime = (dateTime) => {
        // Split the date and time parts
        const [date, time] = dateTime.split('T');
        const formattedTime = time.split('.')[0]; // Remove milliseconds
        return `${date} ${formattedTime}`;
    };

    const startTime = formatDateTime(start_t);
    const endTime = formatDateTime(end_t);

    // console.log("line10>> ",startTime )
    // Concatenate address fields
    const eventLocation = `${first_line_address}, ${second_line_address}, ${city}, ${postcode}`;

    // Construct the calendar event
    const calendarEvent = {
        title: event_name,
        description: description,
        start: `${startTime} UTC`, // E ISO 8601 format
        end: `${endTime} UTC`,
        location: eventLocation,
    };

     const googleUrl = google(calendarEvent);
    //  console.log(googleUrl)

  return (
    <div>
     <a href={googleUrl} target="_blank" rel="noopener noreferrer">
        Add to Google Calendar
      </a>
    </div>
  )
}

export default AddToCalendar
