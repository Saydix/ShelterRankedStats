console.log('Version: 1.0');

const axios = require('axios');

const serverUrl = 'https://shelterstats.glitch.me/';
const targetUrl = 'https://polemicagame.com/game-statistics/197277';

axios.get(`${serverUrl}/getHtml?url=${encodeURIComponent(targetUrl)}`)
  .then(response => {
    console.log(response.data); 
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
