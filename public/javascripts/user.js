document.addEventListener('DOMContentLoaded', function () {
  getUsersData().then((data) => {
    gridBuilder(data);
  });
});

document.getElementById('add').addEventListener('click', function () {
  window.location = '/user/add';
});

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
            gridjs.h(
              'button',
              {
                className: 'btn btn-warning',
                onClick: () =>
                  (window.location = `/user/edit/${row.cells[1].data}`),
              },
              'Edit'
            ),
            ' ',
            gridjs.h(
              'button',
              {
                className: 'btn btn-danger',
                onClick: async () => {
                  const username = row.cells[1].data;

                  const swalConfig = {
                    icon: 'question',
                    text: `Apakah anda yakin menghapus user ${username} ?`,
                    showCancelButton: true,
                    confirmButtonText: 'Ya',
                    cancelButtonText: 'Tidak',
                  };
                  const swalResult = await Swal.fire(swalConfig);

                  if (swalResult.isConfirmed) {

                    const result = await handleDelete(username);
                    if (!result.error) {
                      const users = await getUsersData();
                      gridBuilder(users);
                    }
                  }
                },
              },
              'Delete'
            ),
          ];
        },
      },
    ],
    pagination: true,
    data: data,
  });

  grid.render(gridContainer).forceRender();

  return grid;
}

async function handleDelete(username) {
  try {
    showLoadingOverlay();

    const requestURL = `api/user/${username}`;
    const response = await fetch(requestURL, {
      method: 'DELETE',
    });
    const result = await response.json();
    hideLoadingOverlay();

    return result;
  } catch (error) {
    hideLoadingOverlay();
    console.error(error);
  }
}

async function getUsersData() {
  try {
    showLoadingOverlay();

    const requestURL = `api/user`;
    const response = await fetch(requestURL);
    const result = await response.json();
    hideLoadingOverlay();

    return result;
  } catch (error) {
    hideLoadingOverlay();
    console.error(error);
  }
}

function showLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'none';
}
