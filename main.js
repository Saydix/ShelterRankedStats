console.log('Версия: 1.4');

const addButton = document.querySelector('.addGame');
const apiUrl = 'https://shelterstats.glitch.me'; 

addButton.addEventListener('click', async () => {
  const gameId = prompt('Введите URL игры:', '');

  if (gameId) {
    console.log('Fetching game data for gameId:', gameId); // Отладочный вывод
    try {
        const response = await axios.get(apiUrl, {
        params: { gameId: encodeURIComponent(gameId) },
        });

        const $ = cheerio.load(response.data);
        let text = '';
        $('#app > div > main > div > main > section > div.game-stats-table >' + 
        'div:nth-child(1) > div > div > div > div.table >' + 
        'div:nth-child(2) > div:nth-child(2)').each((i, elem) => {
            text += `${$(elem).text()}\n`
        });

        console.log('Fetched data:', text); // Отладочный вывод
    } catch (error) {
      console.error('Error fetching game data:', error.message);
    }
  } else {
    console.log('URL игры не был введен');
  }
});
