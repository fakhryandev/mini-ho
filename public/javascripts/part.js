const partUrl = 'api/part';

document.addEventListener('DOMContentLoaded', function () {
  getParts().then((data) => {
    gridBuilder(data);
  });
});

const partForm = document.getElementById('partForm');

partForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('partInput');
  const file = fileInput.files[0];

  await handleUploadFile(file);
  const data = await getParts();

  gridBuilder(data);
});

document
  .getElementById('resetPart')
  .addEventListener('click', async function (e) {
    const result = await handleResetPart();
    const data = await getParts();

    gridBuilder(data);
  });

async function handleResetPart() {
  try {
    const response = await fetch(partUrl, {
      method: 'DELETE',
    });
    const result = response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
}

async function handleUploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const result = await postFileToServer(formData);

  return result;
}

async function getParts() {
  try {
    const response = await fetch(partUrl);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
}

async function postFileToServer(formData) {
  try {
    const response = await fetch(partUrl, {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
}

function gridBuilder(data) {
  const gridContainer = document.getElementById('grid');
  gridContainer.innerHTML = '';

  const grid = new gridjs.Grid({
    columns: [
      {
        id: 'partNumber',
        name: 'Part Number',
      },
      {
        id: 'partName',
        name: 'Part Name',
      },
    ],
    pagination: true,
    data: data,
  });

  grid.render(gridContainer).forceRender();

  return grid;
}
