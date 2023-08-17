console.log('Version: 1.5');

const addButton = document.querySelector('.addGame');
const apiUrl = 'https://shelterstats.glitch.me';

addButton.addEventListener('click', fetchGameData);

async function fetchGameData() {
  const gameId = prompt('Введите URL игры:', '');

  if (gameId !== null && gameId !== '') {
    console.log(`Fetching game data for gameId: ${gameId}`);
    try {
      const response = await axios.get(apiUrl, {
        params: { gameId: encodeURIComponent(gameId) },
      });

      console.log('Fetched data:', response.data);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  } else {
    console.log('URL игры не был введен');
  }
}
