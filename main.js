console.log('Version: 1.3');

const serverUrl = 'https://shelterstats.glitch.me/';
const targetUrl = 'https://polemicagame.com/game-statistics/197277';

fetch(`${serverUrl}/getHtml?url=${encodeURIComponent(targetUrl)}`)
  .then(response => response.text())
  .then(data => {
    // console.log(data); // Uncomment this line to see the fetched HTML data

    const playerDataPattern = /"players":\[(.*?)\]/;
    const playerDataMatch = data.match(playerDataPattern);

    if (playerDataMatch) {
      const playerDataJson = `[${playerDataMatch[1]}]`;
      const playerData = JSON.parse(playerDataJson);

      const players = playerData.map(player => ({
        name: player.username,
        role: player.role.title,
        score: player.achievementsSum.points.toFixed(2),
      }));

      const result = {
        "Чья победа": playerData[0].w_l === "win" ? "Победа мирных" : "Победа мафии",
        "Информация по игрокам": players,
      };

      console.log(result);
    } else {
      console.log("Player data not found.");
    }
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
