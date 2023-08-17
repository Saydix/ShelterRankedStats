console.log('Версия: 1.0');

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('.addGame');
    addButton.addEventListener('click', async () => {
        const gameId = prompt('Введите URL игры:', '');

        if (gameId) {
            try {
                const response = await axios.get(`/fetch-game?gameId=${encodeURIComponent(gameId)}`);
                const data = response.data;
                console.log(data);
            } catch (error) {
                console.error('Ошибка работы с URL:', error);
            }
        } else {
            console.log('URL игры не был введен');
        }
    });
});
