// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

let counter = 0;
let lastRequestBody;
let lastRequest;
let successHeaders = "";
let successReqParams = "";
let lastSuccessBody = "{'id': 0, 'message': 'failed'}";

var logFile = 'request_logs.json'

// Middleware to log requests to a JSON file
const logToFile = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    params: req.params,
    body: req.body
  };

  const formattedLogData = JSON.stringify(logData, null, 2);
  fs.appendFileSync(logFile, formattedLogData + '\n\n');
  next();
};

app.use(logToFile);

app.post('/', (req, res) => {
  counter++;
  successHeaders = req.headers;
  successReqParams = req.params;
  lastSuccessBody = req.body;
  lastRequest = req;
  
  console.log(`Request Headers:`);
  console.log(successHeaders);

  console.log(`Request Params:`);
  console.log(successReqParams);

  console.log(`Request Body:`);
  console.log(lastSuccessBody);

  res.json({ counter, successHeaders, successReqParams, lastSuccessBody,});
});

app.get('/last-success-header-body-params', (req, res) => {
  console.log(`Request Headers:`);
  console.log(successHeaders);

  console.log(`Request Params:`);
  console.log(successReqParams);

  console.log(`Request Body:`);
  console.log(lastSuccessBody);

  res.json({ counter, successHeaders, successReqParams, lastSuccessBody,});
});

// API endpoint to get all entries from the JSON file
app.get('/entries', (req, res) => {
  fs.readFile(logFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    try {
      const entries = JSON.parse(data);
      res.json({ entries });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error parsing JSON file' });
    }
  });
});

// API endpoint to clear the content of the JSON file
app.delete('/clear-entries', (req, res) => {
  fs.truncate(logFile, 0, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'File content cleared successfully' });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
