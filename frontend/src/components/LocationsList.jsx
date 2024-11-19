import React, { useEffect, useState } from "react"; 
import { getLocations } from '../api'
import LocationItem from './LocationItem';
import { Link } from "react-router-dom";

const LocationsList = () => {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=> {
        setIsLoading(true);
        getLocations().then((fetchedLocations) => {
            // console.log(fetchedLocations);
            setIsLoading(false);
            setLocations(fetchedLocations)
        });
    },  []);

    if (isLoading) return <div className="loading-container">
      <div className="loader"></div>
      </div> ;
    if (error) return <p>No Results Found</p>;


  return (
    <div>
    <div className="locations-container">
        <h2> Locations</h2>
        <p><Link to={`/create-location`}>Add New Location</Link></p>

        {locations.length ===0 ? (
            <p>No locations here</p>
        ): (
            <div className="locations-list">
                {locations.map((loc)=> (
                    <LocationItem key={loc.location_id} loc={loc} />

                ))}
            </div>

        )}
    </div>
      
    </div>
  )
}

export default LocationsList
