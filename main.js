// Получаем кнопку
const addButton = document.querySelector('.addGame');
let gameId;

addButton.addEventListener('click', async () => {
  try {
    gameId = prompt('Введите URL игры:', '');
    const response = await fetch(gameId);
    const data = await response.text();
    
    console.log(data);
  } catch (error) {
    console.error('Ошибка работы с URL:', error);
  }
});
