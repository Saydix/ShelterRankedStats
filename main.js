console.log('Version: 1.0');

const serverUrl = 'https://shelterstats.glitch.me/';
const targetUrl = 'https://polemicagame.com/game-statistics/197277';

fetch(`${serverUrl}/getHtml?url=${encodeURIComponent(targetUrl)}`)
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
