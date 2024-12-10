import { useState } from 'react'
import { getEvents } from '../api.js'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './EventSearch.css'; 

const EventSearch = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');


const handleSearchChange = (e) => {
    e.preventDefault();

    setSearchText(e.target.value);

    //for dynamic search results
    // const value = e.target.value;
    // setSearchText(value);
    // onSearch(value); 
  };

   // Handle search form submission
   const handleSearchSubmit = (e) => {
    e.preventDefault();  
    onSearch(searchText);  
  };


  return (
    <div className="search-div">
    <form className="search-form" onSubmit={handleSearchSubmit}>
      <input
        className="search__input"
        type="text"
        aria-label="search input"
        placeholder="Search by Title"
        value={searchText}
        onChange={handleSearchChange}
      />
      {/* <input
        type="text"
        placeholder="Search by Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      /> */}
      <button className="search__btn" type="submit">
        <FontAwesomeIcon icon={faMagnifyingGlass}/>
      </button>
    </form>
    </div>
  );
};

export default EventSearch;
