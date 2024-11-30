import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuthContext } from "../hooks/useAuthContext";
import { postEvent, getCategories, getLocations, imageUpload } from "../api";
import TimePickerField from "./TimePickerField";


const CreateEvent = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesAndLocations = async () => {
      try {
        const fetchedCategories = await getCategories();
        const fetchedLocations = await getLocations();
        setCategories(fetchedCategories);
        setLocations(fetchedLocations);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchCategoriesAndLocations();
  }, []);

  const validationSchema = Yup.object().shape({
    event_name: Yup.string().required("Event name is required"),
    description: Yup.string().required("Description is required"),
    startdate: Yup.date().required("Start date is required"),
    starttime: Yup.string()
      .required("Start time is required")
      .matches(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format"),
    enddate: Yup.date().required("End date is required"),
    endtime: Yup.string()
      .required("End time is required")
      .matches(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format"),
    ticket_price: Yup.number()
      .min(0, "Ticket price must be a positive number")
      .required("Ticket price is required"),
    // image_url: Yup.string().url('Invalid URL'),
    category: Yup.string().required("Category is required"),
    location: Yup.string().required("Location is required"),
  });

  //manage file upload
  const handleImageUpload = async (file, setFieldValue) => {
    try {
      const imagePath = await imageUpload(file);
      setFieldValue("image_url", imagePath); // Use the public URL returned by the backend
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Image upload failed");
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    if (user.username === "admin") {
      const newEvent = { ...values }; // Ensure image_url is part of values
      postEvent(values)
        .then((response) => {
          console.log("Event created:", response);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error creating event:", error);
          setError(error.message);
          setSubmitting(false); // Set submitting to false on error
        });
    } else {
      setError("You do not have permission to create an event");
      setSubmitting(false); // Set submitting to false if user is not admin
    }
  };
  if (isLoading)
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );

  return (
    <>
      {user && user.username == "admin" ? (
        <div className="create-event">
          <h2>Create Event</h2>
          {error && <div className="error">{error}</div>}
          <Formik
            initialValues={{
              event_name: "",
              description: "",
              startdate: "",
              starttime: "",
              enddate: "",
              endtime: "",
              ticket_price: "0.00",
              image_url: "",
              category: "",
              location: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <div className="form-group">
                  <label>Event Name</label>
                  <Field type="text" name="event_name" />
                  <ErrorMessage
                    name="event_name"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <Field type="text" name="description" />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <Field type="date" name="startdate" />
                  <ErrorMessage
                    name="startdate"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <TimePickerField name="starttime" label="Start Time" />
                  <ErrorMessage
                    name="starttime"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <Field type="date" name="enddate" />
                  <ErrorMessage
                    name="enddate"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <TimePickerField name="endtime" label="End Time" />
                  <ErrorMessage
                    name="endtime"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>Ticket Price</label>
                  <Field type="number" name="ticket_price" step="0.01" />
                  <ErrorMessage
                    name="ticket_price"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>Upload Image</label>
                  {/* <Field type="text" name="image_url" /> */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleImageUpload(event.target.files[0], setFieldValue)
                    }
                  />
                  <ErrorMessage
                    name="image_url"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <Field as="select" name="category">
                    <option value="" label="Select category" />
                    {categories.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.slug}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <Field as="select" name="location">
                    <option value="" label="Select location" />
                    {locations.map((location) => (
                      <option
                        key={location.location_id}
                        value={location.location_id}
                      >
                        {`${location.postcode}, ${location.first_line_address}, ${location.second_line_address}, ${location.city}`}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="error"
                  />
                </div>
                <button
                  className="form-btn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Create Event
                </button>
              </Form>
            )}
          </Formik>

          <div>
            <p>
              If you cannot find the location, create it first{" "}
              <Link to={"/create-location"}>here</Link>.
            </p>
          </div>
        </div>
      ) : (
        <div className="loading-container">
          <div className="unauth-user">
            <p>If you want to create new event, contact us.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateEvent;
