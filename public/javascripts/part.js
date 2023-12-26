const partUrl = 'api/part';

document.addEventListener('DOMContentLoaded', function () {
  getParts().then((data) => {
    gridBuilder(data);
  });
});

function showLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

const partForm = document.getElementById('partForm');

partForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('partInput');
  const file = fileInput.files[0];

  if (!file) {
    const swalConfig = {
      icon: 'error',
      text: 'Tidak ada file yang diunggah'
    };

    return Swal.fire(swalConfig);
  }

  const requiredFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  if (file.type !== requiredFileType) {
    const swalConfig = {
      icon: 'error',
      text: 'Pilih file XLSX(Excel).'
    };
    fileInput.value = ''

    return Swal.fire(swalConfig);
  }

  const result = await handleUploadFile(file);

 if (result.error) {
  Swal.fire({
    icon: 'error',
    text: result.message
  })
 }

  fileInput.value = ''
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
    showLoadingOverlay()
    const response = await fetch(partUrl, {
      method: 'DELETE',
    });
    const result = response.json();
    hideLoadingOverlay()

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
    showLoadingOverlay()
    const response = await fetch(partUrl);
    const result = await response.json();
    hideLoadingOverlay()
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function postFileToServer(formData) {
  try {
    showLoadingOverlay()

    const response = await fetch(partUrl, {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    hideLoadingOverlay()

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
