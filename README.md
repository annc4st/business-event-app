# business-event-app

### Notes
I am currently working on moving frontend and backend to the same hosting service (my authorization did not work properly because of that)
I am also looking for new postgresql db due to the end of life of the elephantsql.

I found a new db service

Here are the endpoints:
## Auth
- api/auth/login
- api/auth/register
- api/auth/my-events

## Events
- api/events/
- api/events/:event_id
- api/events/:event_id/guests

## Categories
- api/categoires/
- api/categoires/:slug

## Locations
- api/locations/
- api/locations/:location_id


User auth is using JWT.

The frontend is written using React framework.

More notes to follow...
