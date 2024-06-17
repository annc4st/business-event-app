const convertToUTC = (date, time) => {
    // const dateTime = new Date(new Date(`${date}T${time}Z`).getTime() - new Date(`${date}T${time}Z`).getTimezoneOffset() *60000).toISOString();
    // return dateTime;
    const localDateTime = new Date(`${date}T${time}`);
    const offset = localDateTime.getTimezoneOffset() * 60000;
    const utcDateTime = new Date(localDateTime.getTime() - offset).toISOString();
    return utcDateTime;
  }

  module.exports = convertToUTC;
 