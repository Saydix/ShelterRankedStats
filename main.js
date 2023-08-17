console.log('Версия: 1.3');
console.log('Версия: 1.4');

const addButton = document.querySelector('.addGame');
const apiUrl = 'https://shelterstats.glitch.me'; 

addButton.addEventListener('click', async () => {
  const gameId = prompt('Введите URL игры:', '');

  if (gameId) {
    try {
        const response = await axios.get(`${apiUrl}/fetch-game`, {
        params: { gameId: encodeURIComponent(gameId) },
        });

        const $ = cheerio.load(response.data);
        let text = '';
        $('#app > div > main > div > main > section > div.game-stats-table >' + 
        'div:nth-child(1) > div > div > div > div.table >' + 
        'div:nth-child(2) > div:nth-child(2)').each((i, elem) => {
            text += `${$(elem).text()}\n`
        });

        console.log(text);
    } catch (error) {
      console.error('Ошибка работы с URL:', error);
    }
  } else {
    console.log('URL игры не был введен');
  }
});
