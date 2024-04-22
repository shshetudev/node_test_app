// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

let counter = 0;
let lastRequestBody;
let lastRequest;
let successHeaders = "";
let successReqParams = "";
let lastSuccessBody = "{'id': 0, 'message': 'failed'}";

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

app.get('/success', (req, res) => {
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

app.get('/last-success-body', (req, res) => {
  console.log(lastSuccessBody);
  res.json({ counter, lastSuccessBody});
});

app.get('/last-req', (req, res) => {
  console.log(lastRequest);
  res.json({ "request": "printed"});
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

app.get('/status', (req, res) => {
  console.log(lastRequestBody);
  res.json({ counter, lastRequestBody});
});

app.post('/increment', (req, res) => {
  counter++;
  res.json({ counter });
});

app.post('/decrement', (req, res) => {
  counter--;
  res.json({ counter });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
