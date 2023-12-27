const typeUrl = 'api/type';

document.addEventListener('DOMContentLoaded', function () {
  getTypes().then((data) => {
    controlButton(data);
    gridBuilder(data);
  });
});

function showLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

const typeForm = document.getElementById('typeForm');

partForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('typeInput');
  const file = fileInput.files[0];

  if (!file) {
    const swalConfig = {
      icon: 'error',
      text: 'Tidak ada file yang diunggah',
    };

    return Swal.fire(swalConfig);
  }

  const requiredFileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  if (file.type !== requiredFileType) {
    const swalConfig = {
      icon: 'error',
      text: 'Pilih file XLSX(Excel).',
    };
    fileInput.value = '';

    return Swal.fire(swalConfig);
  }

  const result = await handleUploadFile(file);

  if (result.error) {
    Swal.fire({
      icon: 'error',
      text: result.message,
    });
  }

  fileInput.value = '';

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
    showLoadingOverlay();

    const response = await fetch(typeUrl, {
      method: 'DELETE',
    });

    const result = response.json();
    hideLoadingOverlay();

    return result;
  } catch (error) {
    hideLoadingOverlay();

    console.error(error);
  }
}

async function handleUploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const result = await postFileToServer(formData);

  return result;
}

function controlButton(data) {
  if (data.length) {
    document.getElementById('resetType').disabled = false;
    document.getElementById('typeInput').disabled = true;
    document.getElementById('uploadFile').disabled = true;
  }
  if (!data.length) {
    document.getElementById('resetType').disabled = true;
    document.getElementById('typeInput').disabled = false;
    document.getElementById('uploadFile').disabled = false;
  }
}

async function getTypes() {
  try {
    showLoadingOverlay();
    const response = await fetch(typeUrl);
    const result = await response.json();
    hideLoadingOverlay();

    return result;
  } catch (error) {
    hideLoadingOverlay();

    console.error(error);
  }
}

async function postFileToServer(formData) {
  showLoadingOverlay();

  const response = await fetch(typeUrl, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();
  hideLoadingOverlay();

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
