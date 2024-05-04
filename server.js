// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 9090;

app.use(cors());
app.use(express.json());

let counter = 0;
let lastRequestBody;
let lastRequest;
let successHeaders = "";
let successReqParams = "";
let lastSuccessBody = "{'id': 0, 'message': 'failed'}";

const logFile = 'request_logs.json';
let logDataArray = []; // Array to store log data objects

// Middleware to log requests to a JSON file
const logToFile = (req, res, next) => {
  const excludedUrls = ['/entries', '/clear-entries', '/last-success-header-body-params']; // Add more URLs as needed

  if (excludedUrls.includes(req.originalUrl)) {
    // Skip logging and move to the next middleware/route handler
    next();
    return;
  }

  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    params: req.params,
    body: req.body
  };

  logDataArray.push(logData); // Push log data object into array
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

// Endpoint to get all entries from the JSON file
app.get('/entries', (req, res) => {
  res.json({ entries: logDataArray });
});

// Endpoint to clear the content of the JSON file
app.delete('/clear-entries', (req, res) => {
  logDataArray = []; // Clear the log data array
  res.json({ message: 'File content cleared successfully' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Gracefully handle process termination by writing remaining log data to the file
process.on('SIGINT', () => {
  fs.writeFileSync(logFile, JSON.stringify(logDataArray, null, 2));
  process.exit();
});