document.addEventListener('DOMContentLoaded', function () {
  getUsersData().then(data => {
    gridBuilder(data)
  })
});

document.getElementById('add').addEventListener('click', function(){
    console.log('a')
})

function gridBuilder(data) {
  const gridContainer = document.getElementById('grid');
  gridContainer.innerHTML = '';

  const grid = new gridjs.Grid({
    columns: [
      {
        id: 'erro',
        name: 'Erro',
        width: '150px',
      },
      {
        id: 'username',
        name: 'Username',
        width: '150px',
      },
      {
        id: 'name',
        name: 'Nama',
        width: '150px',
      },
      {
      name: 'Actions',
      width: '150px',
      formatter: (cell, row) => {
        return [
          gridjs.h('button', {
            className: 'btn btn-warning',
            onClick: () => alert(`Editing "${row.cells[1].data}" - Action 1`)
          }, 'Edit'),
          ' ',
          gridjs.h('button', {
            className: 'btn btn-danger',
            onClick: () => alert(`Editing "${row.cells[0].data}" - Action 2`)
          }, 'Delete')
        ];
      }
    }
    ],
    pagination: true,
    data: data,
  });

  grid.render(gridContainer).forceRender();

  return grid;
}

async function getUsersData() {
  try {
    showLoadingOverlay();

    const requestURL = `api/user`;
    const response = await fetch(requestURL);
    const result = await response.json();
    hideLoadingOverlay();

    return result
  } catch (error) {
    hideLoadingOverlay();
    console.error(error)
  }
}

function showLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'none';
}
