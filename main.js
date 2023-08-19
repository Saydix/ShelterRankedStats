console.log('Version: 1.2');

let gameUrl = prompt('Введите ссылку на игру:', 'https://polemicagame.com/game-statistics/197277');
let serverUrl = 'https://shelterstats.glitch.me';


async function fetchData() {
  try {
    const response = await fetch(`${serverUrl}/getHtml?url=${encodeURIComponent(gameUrl)}`);
    const data = await response.text();

    const dummyElement = document.createElement('div');
    dummyElement.innerHTML = data;

    const gameDataAttr = dummyElement.querySelector('Gamestats')?.getAttribute(':game-data');

    if (gameDataAttr) {
      const gameData = JSON.parse(gameDataAttr);
      const players = gameData.players.map(player => {
        const achievementsSum = player.achievements.reduce((sum, achievement) => {
          if (typeof achievement.sum === 'number') {
            return sum + achievement.sum;
          }
          return sum;
          }, 0);
    
      return {
        username: player.username,
        role: player.role.title,
        points: achievementsSum, 
        victory: player.w_l === "win" ? "Победа" : "Поражение",
        winnerCode: gameData.winnerCode === 1 ? "Победа Мирных" : "Победа Мафии"
        };
      });
    
      return players;
      } else {
      throw new Error('Не удалось найти атрибут с данными игры');
      }
  } catch (error) {
    console.error('Ошибка обработки:', error);
    return [];
  }
}

fetchData()
  .then(players => {
    console.log(players);
  });
