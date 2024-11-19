import { getEvents, getCategories } from "../api";
import EventItem from "./EventItem";
import React, { useEffect, useState } from "react";
import {Link, Navigate, useNavigate, useParams} from 'react-router-dom';
import NotFound from './errors/NotFound';



const EventsList = () => {
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const {category} = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(category || '');

    // Fetch categories and events based on selected category
    useEffect(() => {
      const fetchCategoriesAndEvents = async () => {
        try {
          setIsLoading(true);
          
          // Fetch categories
          const fetchedCategories = await getCategories();
          setCategories(fetchedCategories);
          
          // Fetch events based on selected category
          const fetchedEvents = await getEvents(selectedCategory);
          setEvents(fetchedEvents);
          
          setIsLoading(false);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError({ message: err.message, status: err.status });
          setIsLoading(false);
        }
      };
  
      fetchCategoriesAndEvents();
    }, [selectedCategory]);

    const handleChangeCategory = (catg) => {
        setSelectedCategory(catg);
        navigate(`/${catg}`);
    };


    if (isLoading) return <div className="loading-container">
      <div className="loader"></div>
      </div> ;
    if (error) return <NotFound />;
    

    return (
        <div>
        <div className="category-selector">
                  {categories.map((catg)=> {
                return (
                    <div key={catg.slug} 
                        className={`category $selectedCategory === catg.slug ? "active" : "not-active"}`}
                        onClick={() => handleChangeCategory(catg.slug)}>
                        <Link to={`/${catg.slug}`}>{catg.slug}</Link>
                    </div>
                )
            })}
        </div>

   
        <div className="events-container ">
            <h2>Events</h2>
            {events.length === 0 ? (
                    <p>No events yet</p>
                ) : (
            <div className="events-list">
                {events && events.map((event) => (
                    <EventItem key = {event.event_id} event = {event} />
                    ))}
            </div>
            )}
                
        </div>
        </div>
    )
}
export default EventsList;