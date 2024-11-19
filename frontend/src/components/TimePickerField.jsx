import React from 'react';
import DatePicker from 'react-datepicker';
import { Field, ErrorMessage, useField } from 'formik';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';



const TimePickerField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;


  const handleChange = (val) => {
    const formattedTime = format(val, 'HH:mm:ss');
    setValue(formattedTime);
  };

  

  return (
    <div>
      <label>{label}</label>
      <DatePicker
 
        selected={field.value ? new Date(`1970-01-01T${field.value}`) : null}
        onChange={handleChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30} 
        timeCaption="Time"
        dateFormat="hh:mm aa" 
      />
      <ErrorMessage name={field.name} component="div" className="error" />
    </div>
  );
};

export default TimePickerField;