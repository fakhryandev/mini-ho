const typeUrl = 'api/type';

document.addEventListener('DOMContentLoaded', function () {
  getTypes().then((data) => {
    controlButton(data);
    gridBuilder(data);
  });
});

const typeForm = document.getElementById('typeForm');

partForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('typeInput');
  const file = fileInput.files[0];

  handleUploadFile(file);
  const data = await getTypes();
  controlButton(data);
  gridBuilder(data);
});

document
  .getElementById('resetType')
  .addEventListener('click', async function (e) {
    const result = await handleResetPart();
    const data = await getTypes();
    controlButton(data);

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

  console.log(result);
  return result;
}

function controlButton(data) {
  if (data.length) {
    document.getElementById('typeInput').disabled = true;
    document.getElementById('uploadFile').disabled = true;
  }
  if (!data.length) {
    document.getElementById('resetType').disabled = true;
  }
}

async function getTypes() {
  try {
    const response = await fetch(typeUrl);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
}

async function postFileToServer(formData) {
  const response = await fetch(typeUrl, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();

  return result;
}

function gridBuilder(data) {
  const gridContainer = document.getElementById('grid');
  gridContainer.innerHTML = '';

  const grid = new gridjs.Grid({
    columns: [
      {
        id: 'unitType',
        name: 'Unit Type',
      },
      {
        id: 'unitName',
        name: 'Unit Name',
      },
    ],
    pagination: true,
    data: data,
  });

  grid.render(gridContainer).forceRender();

  return grid;
}
