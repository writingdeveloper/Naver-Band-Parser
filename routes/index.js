const express = require('express');
const router = express.Router();
const request = require('request');

const clientId='262096660';
const clientSecret='zwJ0mEyKJNjWYDn8pxQrwmMjpxegzea_';

/* GET home page. */
router.get('/', function(req, res, next) {
  request(`https://auth.band.us/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=https://bander-statistics.herokuapp.com/`, function(error, response, body){
  if(error){
    console.log(error);
  }
  console.log(`Status Code : ${response && response.statusCode}`)
  // console.log(`Body : ${body}`)
  // res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
  res.end(body);
  });
  
});

module.exports = router;
