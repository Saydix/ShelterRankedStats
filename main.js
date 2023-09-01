console.log('Version: 2.0');
console.log('Добавлено: ');
console.log('Исправлено: ');


// Игра уже добавлена (Уведомление что игра уже есть (БЕЗ ЗАПРОСА НА СЕРВЕР))
// После загрузки данных добавить - "успешно" всплывающим небольшим окном
// Плавность анимаций

// Инфобокс: "Почему я?!" - Наибольшый луз-стрик
// Резульат интересных опросников из тг
// Добавление игры не только по ссылке, но и по id

let gameUrl; // = prompt('Введите ссылку на игру:', 'https://polemicagame.com/game-statistics/197277');
const getStatsFromPolemica = 'https://shelterstats.glitch.me';
const sendStatsOnServer = 'https://baseshelter.glitch.me/save-game';
const getStatsFromServer = 'https://baseshelter.glitch.me/get-games';
const deleteGameOnServer = 'https://baseshelter.glitch.me/delete-game/';

let players;
let playersJson;

const gameTable = document.getElementById('gameTable');
const gameTableData = document.getElementById('gameTableData');

async function getData() {

  const loadingGamesIndicator = document.getElementById('loadingGamesAnimation');
  const loadingGamesIndicator2 = document.getElementById('loadingGamesAnimation2');
  loadingGamesIndicator.style.display = 'block';
  loadingGamesIndicator2.style.display = 'block';

  try {
    const response = await fetch(getStatsFromServer);
    if (!response.ok) {
      throw new Error('Ошибка при получении данных');
    }

    const data = await response.json();

    const playerStats = {};
    const totalGamesList = [];

    data.forEach(item => {
      if(item._id) {
        totalGamesList.push(item._id);
      }
    });
    const totalGamesCounter = document.getElementById('totalGames');
    totalGamesCounter.textContent = totalGamesList.length;
    
    const gameListId = document.getElementById('gameListId');
    totalGamesList.forEach(id => {
      const row = gameListId.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);

      cell1.textContent = id;
      cell2.textContent = '29.08.2023'; // Заменить на настоящую дату
      cell3.innerHTML = '<div class="deleteButtonBlock"> <button class="deleteButton"> <svg viewBox="0 0 448 512" class="deleteButtonSvg"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg> </button> </div>';
    });


    data.forEach(game => {
      game.allGames.forEach(player => {
        const username = player.username;
        if (!playerStats[username]) {
          playerStats[username] = {
            username,
            games: 0,
            points: 0,
          };
        }
        playerStats[username].games++;
        playerStats[username].points += player.points;
      });
    });

    const soertedPlayers = Object.values(playerStats).sort((a, b) => {
      return b.points / b.games - a.points / a.games;
    });

    soertedPlayers.forEach((player, index) => {
      const row = gameTable.insertRow();
      row.insertCell(0).textContent = index + 1;
      row.insertCell(1).textContent = player.username;
      row.insertCell(2).textContent = player.games;
      row.insertCell(3).textContent = player.points;
      row.insertCell(4).textContent = (player.points / player.games).toFixed(2);
    });

    loadingGamesIndicator.style.display = 'none';
    loadingGamesIndicator2.style.display = 'none';
  } catch (error) {
    console.error('Произошла ошибка:', error);
    loadingGamesIndicator.style.display = 'none';
    loadingGamesIndicator2.style.display = 'none';
  }
}

async function deleteGameInit() {
  await getData();
  const deleteButtons = document.querySelectorAll('.deleteButton');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const gameId = row.cells[0].textContent;
      row.style.display = 'none';
      deleteGame(gameId);
    });
  });
}
deleteGameInit();

async function deleteGame(gameIdInfo) {
  const deleteConfirmation = document.getElementById('deleteConfirmation');
  const deleteConfirmationData = document.getElementById('deleteConfirmationData');
  const deleteConfirmationButtonCancel = document.getElementById('deleteConfirmationButtonCancel');
  const deleteConfirmationButtonDelete = document.getElementById('deleteConfirmationButtonDelete');

  deleteConfirmationData.innerHTML = `Игра ${gameIdInfo} будет удалена`;

  deleteConfirmation.style.display = 'block';

  deleteConfirmationButtonCancel.addEventListener('click', () => {
    deleteConfirmation.style.display = 'none';
  });

  deleteConfirmationButtonDelete.addEventListener('click', () => {
    deleteConfirmation.style.display = 'none';

    fetch(`${deleteGameOnServer}${gameIdInfo}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          // Уведомление "Игра успешно удалена"
        } else {
          // Уведомление "Ошибка удаления игры"
        }
      })
      .catch(error => {
        console.error('Произошла ошибка:', error);
      });
  });
}

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
        points: achievementsSum.toFixed(2), 
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
    // Уведомление
    console.log('Ответ от сервера:', data);
  })
  .catch(error => {
    alert('Ошибка сохранения игры!');
    console.error('Ошибка отправки запроса:', error);
    players = null;
  });
}


document.addEventListener('DOMContentLoaded', function () {
  const infoBoxTotalGames = document.getElementById('infoBoxTotalGames');
  const gameList = document.getElementById('gameList');
  const arrowIcon = document.getElementById('arrowIcon');

  infoBoxTotalGames.addEventListener('click', function () {
      if (event.target === gameList || gameList.contains(event.target)) {
          return;
      }
      if (gameList.style.display === 'none') {
          gameList.style.display = 'block';
          gameList.classList.add('opened');
          arrowIcon.classList.add('opened');
      } else {
          gameList.style.display = 'none';
          gameList.classList.remove('opened');
          arrowIcon.classList.remove('opened');
      }
  });
});

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