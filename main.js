console.log('Version: 1.5');
console.log('Добавлено: Загрузка в таблицу  Исправлено:  ');

//Отображение загрузки после сохранения игры
// Добавить подгрузку данных с базы
// После лоадСкрина - "успешно"

let gameUrl; // = prompt('Введите ссылку на игру:', 'https://polemicagame.com/game-statistics/197277');
const getStatsFromPolemica = 'https://shelterstats.glitch.me';
const sendStatsOnServer = 'https://baseshelter.glitch.me/save-game';
const getStatsFromServer = 'https://baseshelter.glitch.me/get-games';

let players;
let playersJson;

const gameTable = document.getElementById('gameTable');
const gameTableData = document.getElementById('gameTableData');

async function getData() {
  try {
    const response = await fetch(sendStatsOnServer);
    if (!response.ok) {
      throw new Error('Ошибка при получении данных');
    }

    const data = await response.json();

    data.forEach((player, index) => {
      const row = gameTable.insertRow();
      row.insertCell(0).textContent = index + 1;
      row.insertCell(1).textContent = player.nickname;
      row.insertCell(2).textContent = player.games;
      row.insertCell(3).textContent = player.points;
      row.insertCell(4).textContent = player.avgPoints;
    });
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}
getData();

async function fetchData() {
  const loadingIndicator = document.getElementById('loadingPopup');
  addGamePopup1.style.display = 'none';
  loadingIndicator.style.display = 'block';

  try {
    const response = await fetch(`${getStatsFromPolemica}/getHtml?url=${encodeURIComponent(gameUrl)}`);
    const data = await response.text();

    const dummyElement = document.createElement('div');
    dummyElement.innerHTML = data;

    const gameDataAttr = dummyElement.querySelector('Gamestats')?.getAttribute(':game-data');

    if (gameDataAttr) {
      const gameData = JSON.parse(gameDataAttr);

      players = gameData.players.map(player => {
        const achievementsSum = player.achievements.reduce((sum, achievement) => {
          if (typeof achievement.sum === 'number') {
            return sum + achievement.sum;
          }
          return sum;
          }, 0);
    
      return {
        ID: gameData.id,
        username: player.username,
        role: player.role.title,
        points: achievementsSum, 
        victory: player.w_l === "win" ? "Победа" : "Поражение",
        winnerCode: gameData.winnerCode === 1 ? "Победа Мирных" : "Победа Мафии"
        };
      });

      loadingIndicator.style.display = 'none';

      return players;
      } else {
      throw new Error('Не удалось найти атрибут с данными игры');
      }
      
  } catch (error) {
    loadingIndicator.style.display = 'none';
    console.error('Ошибка обработки:', error);
    alert('Ошибка поиска игры'); // Сделать другой вывод ошибки
    return [];
  }
}

async function saveGame(){
  playersJson = JSON.stringify(players);
  fetch(sendStatsOnServer, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: playersJson,
  })
  .then(response => response.json())
  .then(data => {
    console.log('Ответ от сервера:', data);
  })
  .catch(error => {
    alert('Ошибка сохранения игры!');
    console.error('Ошибка отправки запроса:', error);
    players = null;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const openPopupButton = document.getElementById('openPopupButton');
  const closePopupButton1 = document.getElementById('closePopupButton1');
  const closePopupButton2 = document.getElementById('closePopupButton2');
  const gameLink = document.getElementById('gameLinkInput');
  const nextButton = document.getElementById('nextButton');
  const yesButton = document.getElementById('yesButton');
  const noButton = document.getElementById('noButton');
  const gameInfoSpan = document.getElementById('gameInfoForAdd');
  const addGamePopup1 = document.getElementById('addGamePopup1');
  const addGamePopup2 = document.getElementById('addGamePopup2');
  
  openPopupButton.addEventListener('click', function () {
    addGamePopup1.style.display = 'block';
  });

  closePopupButton1.addEventListener('click', function () {
    addGamePopup1.style.display = 'none';
  });

  nextButton.addEventListener('click', function () {
    gameUrl = gameLinkInput.value;
    fetchData()
      .then(players => {
      let gameInfo = players.map(player => {
        return `${player.username} (${player.role}): ${player.points} Баллов <br>`;
      }).join('<br>');
      addGamePopup2.style.display = 'block';
      gameInfoSpan.innerHTML = `Найдено: <br> ${gameInfo}`;
    });
  });

  closePopupButton2.addEventListener('click', function () {
    addGamePopup2.style.display = 'none';
    players = null;
  });

  yesButton.addEventListener('click', function () {
    saveGame();
    addGamePopup2.style.display = 'none';
  });

  noButton.addEventListener('click', function () {
    alert('Не сохранено!');
    addGamePopup2.style.display = 'none';
    players = null;
  });
});