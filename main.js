console.log('Version: 2.0');
console.log('Добавлено: ');
console.log('Исправлено: Неверный подсчет баллов. Работоспособность чек бокса "Не показывать"');

// Разные ники, один игрок (Расм:Rasm готов)

// Сортировка по id во всех играх

// При отмене любой другой игры возвращаются все удаленные игры
// Обновление ДОМ после загрузки игры
// Дата добавления игры
// Сортировка в таблице по разным столбцам
// Надбавка кол-во игр / 1000

// Луз-стрик и Вин-Стрик: Сортировка изсходя из сортирвоанных игры. Чтыб не верный порядок добавляения игр не ломал стрики



// СИМТЕМЫ ПОДСЧЕТОВ:
// Продумать и предложить разные системы игр
// Делить на 20, тех у кого меньше 20 игр?

// Игра уже добавлена (Уведомление что игра уже есть (БЕЗ ЗАПРОСА НА СЕРВЕР))
// После загрузки данных добавить - "успешно" всплывающим небольшим окном
// Плавность анимаций
// Автоочистка поле ввода ссылки для добавления игр
// Отправка ссылки для добавления игр по энтеру
// Информация о игре, которую удаляешь
// При ошибке поиска игры убирать блок с добавлением, сделать другое окно с ошибкой


// ВИЗУАЛ:
// Разделение игроков По 20
// Игры за сегодня (Отображение сезона и выбор дня добавления. Сортировка по колву баллов)

// Сумма минусов за игру(Бессценный игрок)
// Лучший дуэт 
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

    const nickOrigins = {
      'Расм': 'Rasm',

    };

    data.forEach(game => {
      game.allGames.forEach(player => {
        const originalUsername = player.username;
        const sortUsername = nickOrigins[originalUsername] || originalUsername;
        if (!playerStats[sortUsername]) {
          playerStats[sortUsername] = {
            username: sortUsername,
            games: 0,
            points: 0,
          };
        }
        playerStats[sortUsername].games++;
        playerStats[sortUsername].points += player.points;
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
      row.insertCell(3).textContent = (player.points).toFixed(2);
      row.insertCell(4).textContent = (player.points / player.games).toFixed(2);
    });

    console.log(data);
    
    // Диаграмма
    const mafiaWins = data.reduce((total, game) => {
      return total + game.allGames.filter(player => player.winnerCode === 'Победа Мафии').length;
    }, 0);
  
    const civilianWins = data.reduce((total, game) => {
      return total + game.allGames.filter(player => player.winnerCode !== 'Победа Мафии').length;
    }, 0);
    
    console.log(mafiaWins, civilianWins);
    
    const totalGamesCount = data.reduce((total, game) => total + game.allGames.length, 0);
    const winRatio = ((mafiaWins / totalGamesCount) * 100).toFixed(2);

    const winRatioElement = document.getElementById('winRatio');
    winRatioElement.textContent = `${winRatio}%`;
  
   
    const pieChartElement = document.getElementById('infoBoxWinRatioCheese');
    const ctx = pieChartElement.getContext('2d');
  
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Победа Мафии', 'Победа Мирных'],
            datasets: [{
                data: [mafiaWins, civilianWins],
                backgroundColor: ['#000', '#ff0000'], // Цвета 
            }],
        },
    });

    loadingGamesIndicator.style.display = 'none';
    loadingGamesIndicator2.style.display = 'none';
  } catch (error) {
    console.error('Произошла ошибка:', error);
    loadingGamesIndicator.style.display = 'none';
    loadingGamesIndicator2.style.display = 'none';
  }
}

let isHidden;
window.addEventListener('load', () => {
  isHidden = localStorage.getItem('deleteConfirmationRememberChoice');
  if (isHidden === 'true') {
    deleteConfirmationRememberChoice.checked = 'true';
  }
});

async function deleteGameInit() {
  await getData();
 
  let deleteGameInitCount = localStorage.getItem('deleteGameInitCount');
  if (!deleteGameInitCount) {
    deleteGameInitCount = 0;
  }
  

  const deleteButtons = document.querySelectorAll('.deleteButton');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const gameId = row.cells[0].textContent;
      row.style.display = 'none';

      deleteGameInitCount++;

      isHidden = localStorage.getItem('deleteConfirmationRememberChoice');
      if (isHidden === 'true' && deleteGameInitCount <= 50) { 
        deleteGameConfirm(gameId);
        localStorage.setItem('deleteGameInitCount', deleteGameInitCount);
      } else {
        localStorage.setItem('deleteGameInitCount', 0);
        deleteGame(gameId);
      }
      
    });
  });
  
}
deleteGameInit();

async function deleteGameConfirm(gameIdInfo) {
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
}

async function deleteGame(gameIdInfo) {
  const deleteConfirmation = document.getElementById('deleteConfirmation');
  const deleteConfirmationData = document.getElementById('deleteConfirmationData');
  const deleteConfirmationButtonCancel = document.getElementById('deleteConfirmationButtonCancel');
  const deleteConfirmationButtonDelete = document.getElementById('deleteConfirmationButtonDelete');

  deleteConfirmation.style.display = 'block';

  deleteConfirmationData.innerHTML = `Игра ${gameIdInfo} будет удалена`;

  deleteConfirmationButtonCancel.addEventListener('click', () => {
    const rows = document.querySelectorAll('#gameListId tr');
    rows.forEach(row => {
      if (row.cells[0].textContent === gameIdInfo) {
        row.style.display = 'table-row';
      }
    });
    deleteConfirmation.style.display = 'none';
  });

  deleteConfirmationButtonDelete.addEventListener('click', () => {
    if (deleteConfirmationRememberChoice.checked) {
      localStorage.setItem('deleteConfirmationRememberChoice', 'true');
    } else {
      localStorage.removeItem('deleteConfirmationRememberChoice');
    }
    deleteConfirmation.style.display = 'none';
    deleteGameConfirm(gameIdInfo);
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
        points: parseFloat(achievementsSum.toFixed(2)), 
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

function sortGamesById() {
  const tableBody = document.getElementById('gameListId');
  const rows = Array.from(tableBody.getElementsByTagName('tr'));

  rows.sort((a, b) => {
    const idA = parseInt(a.querySelector('td:first-child').textContent);
    const idB = parseInt(b.querySelector('td:first-child').textContent);
    return idB - idA;
  });

  rows.forEach(row => tableBody.removeChild(row));

  rows.forEach(row => tableBody.appendChild(row));
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

          sortGamesById();
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