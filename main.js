console.log('Версия: 1.5');

const addButton = document.querySelector('.addGame');
const apiUrl = 'https://shelterstats.glitch.me';

addButton.addEventListener('click', async () => {
  const gameId = prompt('Введите URL игры:', '');

  if (gameId) {
    console.log('Fetching game data for gameId:', gameId);
    try {
      const response = await axios.get(apiUrl, {
        params: { gameId: encodeURIComponent(gameId) },
      });

      console.log('Fetched data:', response.data);
    } catch (error) {
      console.error('Error fetching game data:', error.message);
    }
  } else {
    console.log('URL игры не был введен');
  }
});
