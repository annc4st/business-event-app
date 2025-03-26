import React, { useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createLocation } from '../api';  
// import { UserContext } from '../contexts/UserContext';

import { useAuthContext } from '../hooks/useAuthContext'
import validator from 'validator';
const postcodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i;


const CreateLocation = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    
  const validationSchema = Yup.object().shape({
    postcode: Yup.string()
      .required('Postcode is required')
      .test('is-valid-postcode', 'Invalid postcode', (value) => validator.isPostalCode(value, 'any')),
      // .matches(postcodeRegex, 'Invalid postcode'),
    first_line_address: Yup.string().required('First line of address is required'),
    second_line_address: Yup.string().required('Second line of address is required'),
    city: Yup.string().required('City is required').test('is-valid-city', 'Invalid City', (value) => validator.isAlpha(value, 'en-US', { ignore: ' ' })),
  });
 
      const handleSubmit= (values, { setSubmitting }) => {
  
        if(user.username =="admin" ){
          createLocation(values)
          .then((response) => {
            console.log('Location created:', response.data);
            navigate('/locations'); // Redirect to locations list or appropriate page
          })
          .catch((error) => {
            console.error('Error creating location:', error);
            setError(error.message);
            setSubmitting(false);
          });
        } else {
          setError('You do not have permission to create a location');
          setSubmitting(false);
        }
      };
  
  return (
    <div className='post-location'>
   
   <h2>Create Location</h2>
      {error && <div className="error">{error}</div>}
      <Formik
        initialValues={{
          postcode: '',
          first_line_address: '',
          second_line_address: '',
          city: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
          <div className='form-group'>
              <label>Postcode</label>
              <Field type="text" name="postcode" />
              <ErrorMessage name="postcode" component="div" className="error" />
            </div>
            <div className='form-group'>
              <label>First line of address</label>
              <Field type="text" name="first_line_address" />
              <ErrorMessage name="first_line_address" component="div" className="error" />
            </div>
            <div className='form-group'>
              <label>Second line of address</label>
              <Field type="text" name="second_line_address" />
              <ErrorMessage name="second_line_address" component="div" className="error" />
            </div>
            <div className='form-group'>
              <label>City</label>
              <Field type="text" name="city" />
              <ErrorMessage name="city" component="div" className="error" />
            </div>
            <button className="form-btn" type="submit" disabled={isSubmitting}>
              Create Location
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CreateLocation
