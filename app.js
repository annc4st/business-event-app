const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api-router'); // add when ready



const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);


app.all('/*',(request, response) =>{
    response.status(404).send({ message: 'path is not found'})  //to change to Bad Request
  })

//Error handling

app.use((error, req, res, next) => {
  if (error.code === '22P02') {
    res.status(400).send({ message: 'Invalid input syntax'})
  }

  if (error.status && error.message) {
    res.status(error.status).send({ message: error.message });
  } 
    else {
    res.status(500).send({ message: 'Internal server error' });
  }
  });



module.exports = app;