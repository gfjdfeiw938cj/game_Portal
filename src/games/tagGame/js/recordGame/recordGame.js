const port = import.meta.env.VITE_PORT;


let btnExit = document.querySelector('#recordGameExit')

let records = JSON.parse(localStorage.getItem('objVictoryGame')) || []

btnExit.addEventListener('click', function(){
  const currentPath = window.location.pathname;
  const newPath = currentPath.replace(/\/[^/]+\/[^/]+$/, '') + '/mainMenu.html';
  window.location.href = newPath;
})

function deleteRecord(index) {
  records.splice(index, 1)
  localStorage.setItem('objVictoryGame', JSON.stringify(records.toSpliced(index, 1)));
  renderRecords()
}

function renderRecords() {
  const tbody = document.querySelector('#recordsTable tbody');

  tbody.innerHTML = ''; 

  records.forEach((record, indexMapRecordGame) => {
    const row = document.createElement('tr');

    const cellNumber = document.createElement('td');
    cellNumber.textContent = indexMapRecordGame + 1;
    row.append(cellNumber);

    const cellCounterMove = document.createElement('td');
    cellCounterMove.textContent = record.couterMove;
    row.append(cellCounterMove);

    const cellTime = document.createElement('td');
    cellTime.textContent = record.time;
    row.append(cellTime);

    const cellDash = document.createElement('td');
    cellDash.textContent = record.date;
    row.append(cellDash);

    const cellSize = document.createElement('td');
    const width = record.GameSettings[0].length;
    const height = record.GameSettings[0][0].length;
    cellSize.textContent = `${width}x${height}`;
    row.append(cellSize);

    const cellButtons = document.createElement('td');

    const btnDelete = document.createElement('button');
    btnDelete.className = 'delete-btn';
    btnDelete.textContent = 'Удалить';
    btnDelete.addEventListener('click', () => deleteRecord(indexMapRecordGame));
    cellButtons.append(btnDelete);

    const btnView = document.createElement('button');
    btnView.className = 'delete-btn'; 
    btnView.textContent = 'Посмотреть игру';
    btnView.addEventListener('click', () => viewingRecordedGame(indexMapRecordGame));
    cellButtons.append(btnView);

    row.append(cellButtons);
    tbody.append(row);
});
}
renderRecords()

function viewingRecordedGame(indexMapRecordGame){
  const currentPath = window.location.pathname;
  const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
  window.location.href = basePath + `tagGame.html?indMap=${indexMapRecordGame}`;
  // window.location.href = `../../pages/tagGame.html?indMap=${indexMapRecordGame}`;
}





