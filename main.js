console.log('Version: 1.2');

let serverUrl = 'https://shelterstats.glitch.me';
const targetUrl = 'https://polemicagame.com/game-statistics/197277';


async function fetchData() {
  try {
    const response = await fetch(`${serverUrl}/getHtml?url=${encodeURIComponent(targetUrl)}`);
    const data = await response.text();

    const dummyElement = document.createElement('div');
    dummyElement.innerHTML = data;

    const gameDataAttr = dummyElement.querySelector('Gamestats')?.getAttribute(':game-data');

    if (gameDataAttr) {
      const gameData = JSON.parse(gameDataAttr);
      const players = gameData.players.map(player => {
        return {
          username: player.username,
          role: player.role.title,
          points: player.points,
          victory: player.w_l === "win" ? "Победа" : "Поражение",
          winnerCode: gameData.winnerCode === 1 ? "Победа Мирных" : "Победа Мафии"
        };
      });

      return players;
    } else {
      throw new Error('Could not find game data attribute');
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return [];
  }
}

fetchData()
  .then(players => {
    console.log(players);
  });
