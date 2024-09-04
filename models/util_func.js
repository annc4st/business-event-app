const jwt = require('jsonwebtoken');

const convertToUTC = (date, time) => {
    const localDateTime = new Date(`${date}T${time}`);
    const offset = localDateTime.getTimezoneOffset() * 60000;
    const utcDateTime = new Date(localDateTime.getTime() - offset).toISOString();
    return utcDateTime;
  }

  
  const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: "3h" });
  };


  module.exports = { convertToUTC, createToken }
 