import React from 'react'


const LocationItem = ({loc}) => {
  return (
    <div className="location-item">
     <h3>Location ID: {loc.location_id}</h3>
        <p>{loc.postcode}</p>
         <p>{loc.first_line_address}, {loc.second_line_address}</p>
        <p>{loc.city}</p>
    </div>
  )
}

export default LocationItem