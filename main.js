console.log('Version: 1.1');

const serverUrl = 'https://shelterstats.glitch.me/';
const targetUrl = 'https://polemicagame.com/game-statistics/197277';

fetch(`${serverUrl}/getHtml?url=${encodeURIComponent(targetUrl)}`)
  .then(response => response.text())
  .then(data => {
    // console.log(data);
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });


const dummyElement = document.createElement('div');
dummyElement.innerHTML = data;

const gameDataAttr = dummyElement.querySelector('Gamestats').getAttribute(':game-data');
const gameData = JSON.parse(gameDataAttr);

const players = gameData.players;

const nicknames = [];

for (const player of players) {
    const username = player.username;
    nicknames.push(username);
}

console.log(nicknames);