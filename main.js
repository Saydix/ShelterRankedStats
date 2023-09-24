console.log('Version: 2.7');
console.log('Добавлено: ');
console.log('Исправлено: ');

// Разные ники, добавлять в nickOrigins. 91

// Нажатие с интересной инфой на каждую плитку

// починить, вернуть makeScreenshot

// При отмене любой другой игры возвращаются все удаленные игры
// Обновление ДОМ после загрузки игры
// Дата добавления игры
// Сортировка в таблице по разным столбцам
// Надбавка кол-во игр / 1000

// Луз-стрик и Вин-Стрик: Сортировка изсходя из сортирвоанных игры. Чтыб не верный порядок добавляения игр не ломал стрики


// Игра уже добавлена (Уведомление что игра уже есть (БЕЗ ЗАПРОСА НА СЕРВЕР))
// После загрузки данных добавить - "успешно" всплывающим небольшим окном
// Плавность анимаций
// Автоочистка поле ввода ссылки для добавления игр
// Отправка ссылки для добавления игр по энтеру
// Информация о игре, которую удаляешь
// При ошибке поиска игры убирать блок с добавлением, сделать другое окно с ошибкой

// Разделение игроков По 20
// Игры за сегодня (Отображение сезона и выбор дня добавления. Сортировка по колву баллов)

// Лучший красный/Черный игрок

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

    /* Лагает окно из-за перегруженности консоли :) 
    data.forEach(item => {
      console.log(`_id: ${item._id}, addGameDate: ${item.addGameDate}`);
      console.table(item.allGames);
      console.log('---------------------------------------------');
    });
    */
    console.log(data);

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
      const cell4 = row.insertCell(3);

      cell1.textContent = id;
      cell2.innerHTML = '<div class="editButtonContainer"> <button class="editButton"> <svg fill="#000000" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,12a1,1,0,0,0-1,1v6a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4h6a1,1,0,0,0,0-2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM6,12.76V17a1,1,0,0,0,1,1h4.24a1,1,0,0,0,.71-.29l6.92-6.93h0L21.71,8a1,1,0,0,0,0-1.42L17.47,2.29a1,1,0,0,0-1.42,0L13.23,5.12h0L6.29,12.05A1,1,0,0,0,6,12.76ZM16.76,4.41l2.83,2.83L18.17,8.66,15.34,5.83ZM8,13.17l5.93-5.93,2.83,2.83L10.83,16H8Z"/></svg> </button> </div>';
      const gameData = data.find(item => item._id === id);
      const gameDate = gameData && gameData.addGameDate ? gameData.addGameDate : '??/??/????';
      cell3.textContent = gameDate;
      cell4.innerHTML = '<div class="deleteButtonBlock"> <button class="deleteButton"> <svg viewBox="0 0 448 512" class="deleteButtonSvg"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg> </button> </div>';
    });

    const nickOrigins = { // Убрать, когда доделаю функци и ручной замены
      'Расм': 'Rasm',
      'Lissik': 'Carveryу',
      'Малавита': 'Ам0ндочка',

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


    const sortedPlayers = Object.values(playerStats).sort((a, b) => {
      const aGames = a.games;
      const bGames = b.games;
    
      if (aGames >= 20 && bGames >= 20) {
        return b.points / bGames - a.points / aGames;
      } else if (aGames >= 20) {
        return -1;
      } else if (bGames >= 20) {
        return 1;
      } else if (aGames >= 10 && bGames >= 10) {
        return b.points / bGames - a.points / aGames;
      } else if (aGames >= 10) {
        return -1;
      } else if (bGames >= 10) {
        return 1;
      } else {
        return b.points / bGames - a.points / aGames;
      }
    });
    
    sortedPlayers.forEach((player, index) => {
      const row = gameTable.insertRow();
      row.insertCell(0).textContent = index + 1;
      row.insertCell(1).textContent = player.username;
      row.insertCell(2).textContent = player.games;
      row.insertCell(3).textContent = (player.points).toFixed(2);
      row.insertCell(4).textContent = (player.points / player.games).toFixed(2);
    });
    
    winRatioChart(data);
    findBestDuo(data);
    findPricelessPlayer(data);
    findConsecutiveWinner(data);
    
    deleteGameInit();
    editGameButton(data);

    loadingGamesIndicator.style.display = 'none';
    loadingGamesIndicator2.style.display = 'none';
  } catch (error) {
    console.error('Произошла ошибка:', error);
    loadingGamesIndicator.style.display = 'none';
    loadingGamesIndicator2.style.display = 'none';
  }
}
getData();

async function winRatioChart(data) {
  const allGames = data.flatMap(game => game.allGames);
  const mafiaWins = allGames.filter(player => player.winnerCode === 'Победа Мафии').length;
  const civilianWins = allGames.filter(player => player.winnerCode !== 'Победа Мафии').length;

  const totalGamesCount = allGames.length;
  const winRatio = ((mafiaWins / totalGamesCount) * 100).toFixed(2);

  const winRatioElement = document.getElementById('winRatio');
  winRatioElement.textContent = `${winRatio}%`;

  const pieChartElement = document.getElementById('infoBoxWinRatioCheese');
  const ctx = pieChartElement.getContext('2d');

  new Chart(ctx, {
      type: 'pie',
      data: {
          labels: ['Побед Мафии', 'Побед Мирных'],
          datasets: [{
              data: [(mafiaWins / 10), (civilianWins / 10)],
              backgroundColor: ['#000000', '#ec1c24'], 
          }],
      },
  });
}
async function findBestDuo(data) {
  const allMafiaWinnersGroup = [];
  const allCivilWinnersGroup = [];
  for(const game of data) {
      const winnerCode = game.allGames[0].winnerCode;
      if(winnerCode === 'Победа Мафии'){
          const mafiaWinnersGroup = [];
          for (const player of game.allGames) {
              if (player.role === 'Мафия' || player.role === 'Дон'){
                  mafiaWinnersGroup.push(player.username);
              }
          }
          allMafiaWinnersGroup.push(mafiaWinnersGroup);
      }
      else if(winnerCode === 'Победа Мирных') {
          const civilWinnersGroup = [];
          for (const player of game.allGames) {
              if (player.role === 'Мирный' || player.role === 'Шериф'){
                  civilWinnersGroup.push(player.username);
              }
          }
          allCivilWinnersGroup.push(civilWinnersGroup);
      }
  }
  // console.log(allMafiaWinnersGroup);
  // console.log(allCivilWinnersGroup);

  function findFrequentPairs(groupToFind) {
      const namePairsCount = {};

      for (const group of groupToFind) {
          const namePairs = [];
          for (let i = 0; i < group.length; i++) {
              for (let j = i + 1; j < group.length; j++) {
                  const cleanedName1 = group[i].replace(/[\(\)\s]/g, '');
                  const cleanedName2 = group[j].replace(/[\(\)\s]/g, '');
                  const sortedNames = [cleanedName1, cleanedName2].sort();
                  const pairKey = sortedNames.join(' / ');
                  namePairsCount[pairKey] = (namePairsCount[pairKey] || 0) + 1;
                  // console.log(namePairsCount);
              }
          }
      }
      const namePairsCountArray = Object.entries(namePairsCount);
      namePairsCountArray.sort((a, b) => b[1] - a[1]);
      const topPair = namePairsCountArray[0];
      const topPairNames = topPair[0].split(',');
      return topPairNames;
  }
  const civilDuo = document.getElementById('civilDuo');
  const bestCivilPair = findFrequentPairs(allCivilWinnersGroup);
  civilDuo.textContent = bestCivilPair;
  
  const mafiaDuo = document.getElementById('mafiaDuo');
  const bestMafiaPair = findFrequentPairs(allMafiaWinnersGroup);
  mafiaDuo.textContent = bestMafiaPair;
}

let isHidden;
window.addEventListener('load', () => {
  isHidden = localStorage.getItem('deleteConfirmationRememberChoice');
  if (isHidden === 'true') {
    deleteConfirmationRememberChoice.checked = 'true';
  }
});

async function deleteGameInit() {
  let deleteGameInitCount = localStorage.getItem('deleteGameInitCount');
  if (!deleteGameInitCount) {
    deleteGameInitCount = 0;
  }
  

  const deleteButtons = document.querySelectorAll('.deleteButton');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const gameId = row.cells[0].textContent;
      console.log('Клик делит');
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

async function editGameButton(data) {
  const editButtons = document.querySelectorAll('.editButton');
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const gameId = row.cells[0].textContent;
      console.log('Клик эдит');
      editGame(gameId, data);
    })  
  })  
}
async function editGame(gameId, data) {
  const editConfirmation = document.getElementById('editConfirmation');
  const gameDataId = document.getElementById('editConfirmationGameId');
  const editConfirmationButtonCancel = document.getElementById('editConfirmationButtonCancel');
  const editConfirmationButtonSaveEdit = document.getElementById('editConfirmationButtonSaveEdit');
  const editConfirmationData = document.getElementById('editConfirmationData');

  editConfirmation.style.display = 'block';
  gameDataId.innerHTML = `Изменить игру  ${gameId}`;

  

  editConfirmationButtonCancel.addEventListener('click', () => {
    editConfirmation.style.display = 'none';
  });
}



async function findPricelessPlayer(data) {
  const playersScores = {};

  data.forEach(game => {
    game.allGames.forEach(playerGame => {
      const username = playerGame.username;
      const points = playerGame.points;

      if (points < 0) {
        if (playersScores[username]) {
          playersScores[username] += points;
        } else {
          playersScores[username] = points;
        }
      }
      
    });
  });

  for (const username in playersScores) {
    playersScores[username] = Math.abs(playersScores[username]);
  }

  let maxScoreUser = null;

  for (const username in playersScores) {
    if (maxScoreUser === null || playersScores[username] > playersScores[maxScoreUser]) {
      maxScoreUser = username;
    }
  }

  const pricelessPlayer = document.getElementById('pricelessPlayer');
  pricelessPlayer.textContent = maxScoreUser;
}

async function findConsecutiveWinner(data) {
  data.sort(function (a, b) {
    return parseInt(a._id) - parseInt(b._id);
  });

  data.forEach(function (game) {
      game.allGames.sort(function (gameA, gameB) {
          return parseInt(gameA.ID) - parseInt(gameB.ID);
      });
  });

  let results = {};

  data.forEach(function (game){
    game.allGames.forEach(function (playerGame) {
      let username = playerGame.username;
      let role = playerGame.role;
      let victory = playerGame.victory;

      if (!results[username]) {
        results[username] = { mafiaStreak: 0, mafiaMaxStreak: 0, civilianStreak: 0, civilianMaxStreak: 0 };
      }

      if ((role === "Мафия" || role === "Дон") && victory === "Победа") {
        results[username].mafiaStreak++;
        if (results[username].mafiaStreak > results[username].mafiaMaxStreak) {
            results[username].mafiaMaxStreak = results[username].mafiaStreak;
        }
      } else if ((role === "Мафия" || role === "Дон") && victory === "Поражение") {
        results[username].mafiaStreak = 0;
      } else if ((role === "Мирный" || role === "Шериф") && victory === "Победа") {
        results[username].civilianStreak++;
        if (results[username].civilianStreak > results[username].civilianMaxStreak) {
            results[username].civilianMaxStreak = results[username].civilianStreak;
        }
      } else if ((role === "Мирный" || role === "Шериф") && victory === "Поражение") {
        results[username].civilianStreak = 0;
      }
    });
  });

  console.table(results);

  let maxMafiaStreak = 0;
  let maxMafiaStreakUsername = '';
  let maxCivilStreak = 0;
  let maxCivilStreakUsername = '';

  const civilBestStreakFirePngContainer = document.getElementById('civilBestStreakFirePngContainer');
  const mafiaBestStreakFirePngContainer = document.getElementById('mafiaBestStreakFirePngContainer');
  
  for (const username in results) {
    const userData = results[username];

    if (userData.mafiaMaxStreak > maxMafiaStreak) {
      maxMafiaStreak = userData.mafiaMaxStreak;
      maxMafiaStreakUsername = username;
      if (userData.mafiaMaxStreak == userData.mafiaStreak) {
        mafiaBestStreakFirePngContainer.style.display = 'block';
      } else {
        mafiaBestStreakFirePngContainer.style.display = 'none';
      }
    }
    if (userData.civilianMaxStreak > maxCivilStreak) {
      maxCivilStreak = userData.civilianMaxStreak;
      maxCivilStreakUsername = username;
      if (userData.civilianMaxStreak == userData.civilianStreak) {
        civilBestStreakFirePngContainer.style.display = 'block'; 
      } else {
        civilBestStreakFirePngContainer.style.display = 'none';
      }
    }
  }
  const civilBestStreakElement = document.getElementById('civilBestStreak');
  const civilBestStreakCounterElement = document.getElementById('civilBestStreakCounter')
  const mafiaBestStreakElement = document.getElementById('mafiaBestStreak');
  const mafiaBestStreakCounterElement = document.getElementById('mafiaBestStreakCounter');

  civilBestStreakElement.textContent = maxCivilStreakUsername;
  civilBestStreakCounterElement.textContent = maxCivilStreak;
  mafiaBestStreakElement.textContent = maxMafiaStreakUsername;
  mafiaBestStreakCounterElement.textContent = maxMafiaStreak;
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

switchThemeCheckbox.addEventListener('change', function() {
  if (switchThemeCheckbox.checked) {
    localStorage.setItem("whiteTheme", "yes");
    switchTheme();
  } else {
    localStorage.setItem("whiteTheme", "no");
    switchTheme();
  }
});

function switchTheme() {
  const switchThemeCheckbox = document.getElementById('switchThemeCheckbox');
  const checkThemeInStorage = localStorage.getItem('whiteTheme');
  const switchThemeStyle = document.getElementById('switchThemeStyle');

  if (checkThemeInStorage === 'yes') {

    switchThemeCheckbox.checked = true;
    
  } else if (checkThemeInStorage === 'no') {

    switchThemeCheckbox.checked = false;
    
  } else {

    localStorage.setItem('whiteTheme', 'yes');
    switchThemeCheckbox.checked = true;
    
  }

}
switchTheme();


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

document.getElementById('makeScreenShot').addEventListener('click', function() {
  makeScreenShot('container');
});

function makeScreenShot(screenToShot) {
  const screenContainer = document.getElementById(screenToShot);

  const marginLeft = window.getComputedStyle(screenContainer).marginLeft;

  const marginLeftValue = parseFloat(marginLeft);

  const options = {
    width: screenContainer.offsetWidth + marginLeftValue, 
    height: screenContainer.offsetHeight
  };

  domtoimage.toBlob(screenContainer, options)
    .then(function(blob) {
      const item = new ClipboardItem({ 'image/png': blob });

      navigator.clipboard.write([item])
        .then(function() {
          console.log('Скриншот скопирован в буфер обмена.');
        })
        .catch(function(err) {
          console.error('Произошла ошибка при копировании скриншота в буфер обмена:', err);
        });
    })
    .catch(function(error) {
      console.error('Произошла ошибка при создании скриншота:', error);
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


