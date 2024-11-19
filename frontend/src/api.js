import axios from "axios";

const eventsApi = axios.create ({
    baseURL : "http://localhost:9000/api",
    // baseURL : "https://business-event-app.onrender.com/api",
    withCredentials: true,
})


export const getEvents = async (category) => {
    let params = {};
    if (category){
        params.category = category;
    }
    const response = await eventsApi.get('/events', {params})
    return  response.data;
}


export const getCategories = async () => {
    const response = await eventsApi.get('/categories');
    return response.data;
}
  

export const getEvent = async (event_id) => {
    try {
        const response = await eventsApi.get(`/events/${event_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const postEvent = async (newEvent) => {
    try{
        const response = await eventsApi.post(`/events`, newEvent);
        return response.data;
    } catch (error){
        throw error;
    }
}

//add user to guestlist for event when user signs up
export const addGuest = (event_id, userId, token) => {
    return eventsApi.patch(`/events/${event_id}/guests`,  { id: userId }, {
        headers: {
            'Authorization': `Bearer ${token}`, // Assuming you have a token
            'Content-Type': 'application/json'
          }
    })
    .then((response) => {
        // console.log("api.js line 60>> ",response.data);
        return response.data;
    })
    .catch((error) => {
        console.error('Error updating guest list:', error);
        throw error;
      });
}

//remove user from guestlist by admin
export const removeGuest = (event_id, userId) => {
    return eventsApi.delete(`/events/${event_id}/guests`,  { id: userId })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        // console.error('Error removing  guest from list:', error);
        throw error;
      });
}

export const getGuests = (event_id) => {
    return eventsApi.get(`/events/${event_id}/guests`)
    .then((response)=> {
        console.log("api.js line 85> ",response.data);
        return response.data;
    })
    .catch((error) => {
        console.error("Getting all guests ", error)
        throw error;
    })
}

export const getLocations = async() => {
    const response = await eventsApi.get(`/locations`)
    return response.data;
}

export const getLocationById = async(location_id) => {
    const response = await eventsApi.get(`/locations/${location_id}`)
    return response.data;
}

export const createLocation = async (newLocation) => {
    const response = await eventsApi.post(`/locations`, newLocation);
    // console.log("create locations ", response.data)
    return response.data;
}

export const deleteLocation = (location_id) => {
    return eventsApi.delete(`/locations/${location_id}`)
    .then(() => {
        // console.log(`Location ${location_id} has been deleted successfully`)
    })
    .catch((error) => {
        console.log('Error : ', error)
    })
}



export const registerUser = async (userData) => {
    try {
        const response = await eventsApi.post(`/auth/register`, userData)
 
        return response.data;
    } catch(error) {
 
        if (error.response && error.response.data && error.response.data.message) {
            
            throw new Error(error.response.data.message);
          } else {
            console.log(error);
            throw new Error('An error occurred. Looks like we have account with this username or email.');
          }
    }
}

// Function to login a user
export const loginUser = async ( credentials) => {

    try {
        const response = await eventsApi.post(`/auth/login`, credentials);
        console.log(response.data)
         return  response.data
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            // Throwing backend-specific error message
            throw new Error(error.response.data.error);
          } else {
            throw new Error('An unexpected error occurred.');
          }
    }
  };

  // Function to retrieven events user signed up for
  export const getUserSignedUpEvents = async(token) => {
    try {
        const response = await eventsApi.get(`/auth/my-events`, {
            headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
        })
        return response.data;
    } catch(error){
        console.error('Error fetching signed-up events:', error);
        throw error;
    }
  }
