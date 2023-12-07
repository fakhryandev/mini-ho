document.addEventListener('DOMContentLoaded', async function () {
  const flatPickSelector = [
    {
      selector: 'tanggalAwal',
      type: 'start',
    },
    {
      selector: 'tanggalAkhir',
      type: 'current',
    },
  ];

  flatPickSelector.map((item) => flatPickBuilder(item));

  const data = [];
  gridBuilder(data);
});

function showLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

function flatPickBuilder(item) {
  const { selector, type } = item;
  const defaultDate =
    type === 'current'
      ? new Date()
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const flatPickrConfig = {
    dateFormat: 'd-m-Y',
    allowInput: true,
    defaultDate,
  };

  flatpickr(`#${selector}`, flatPickrConfig);
}

document.getElementById('add').addEventListener('click', function () {
  window.location = '/add';
});

document.getElementById('report').addEventListener('click', function () {
  const startDate = document.getElementById('tanggalAwal').value;
  const endDate = document.getElementById('tanggalAkhir').value;

  const { valid, message } = validateRange(startDate, endDate);

  if (valid) {
    generateReport(startDate, endDate);
  } else {
    const swalConfig = {
      icon: 'error',
      text: message,
    };

    Swal.fire(swalConfig);
  }
});

document.getElementById('search').addEventListener('click', function () {
  const startDate = document.getElementById('tanggalAwal').value;
  const endDate = document.getElementById('tanggalAkhir').value;

  const { valid, message } = validateRange(startDate, endDate);

  if (valid) {
    getRequestParts(startDate, endDate);
  } else {
    const swalConfig = {
      icon: 'error',
      text: message,
    };

    Swal.fire(swalConfig);
  }
});

function parseDate(dateString) {
  const [day, month, year] = dateString.split('-');

  return new Date(year, month - 1, day);
}

function validateRange(startDate, endDate) {
  const startDateConverted = parseDate(startDate);
  const endDateConverted = parseDate(endDate);

  if (startDateConverted > endDateConverted) {
    return {
      valid: false,
      message: 'Tanggal awal tidak boleh lebih besar dari tanggal akhir.',
    };
  }
  const timeDifference = endDateConverted - startDateConverted;
  const dayDifference = timeDifference / (1000 * 3600 * 24);

  if (dayDifference > 90) {
    return {
      valid: false,
      message: 'Batas maksimal adalah 3 bulan (90 hari)',
    };
  }

  return {
    valid: true,
    message: '',
  };
}

function gridBuilder(data) {
  console.log(data);
  const gridContainer = document.getElementById('grid');
  gridContainer.innerHTML = '';

  const grid = new gridjs.Grid({
    columns: [
      {
        id: 'nomor',
        name: 'Nomor Hotline',
      },
      {
        id: 'nik',
        name: 'KTP',
      },
      {
        id: 'nama',
        name: 'Nama',
      },
      {
        id: 'noka',
        name: 'Nomor Rangka',
      },
      {
        id: 'nosin',
        name: 'Nomor Mesin',
      },
      {
        id: 'type',
        name: 'Type Motor',
      },
      {
        id: 'tahun',
        name: 'Tahun Motor',
      },
      {
        id: 'part',
        name: 'Part Number',
      },
      {
        id: 'create_at',
        name: 'Tanggal Permintaan',
      },
    ],
    pagination: true,
    data: data,
  });

  grid.render(gridContainer).forceRender();

  return grid;
}

async function generateReport(startDate, endDate) {
  try {
    showLoadingOverlay();

    const requestURL = `api/request/generate-report?startDate=${startDate}&endDate=${endDate}`;
    const response = await fetch(requestURL);

    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition.split('filename=')[1];
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'request_parts.xlsx';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    hideLoadingOverlay();
  } catch (error) {
    console.error(error.message);
  }
}

async function getRequestParts(startDate, endDate) {
  showLoadingOverlay();

  const requestURL = `api/request?startDate=${startDate}&endDate=${endDate}`;
  const response = await fetch(requestURL);
  const result = await response.json();
  hideLoadingOverlay();

  gridBuilder(result);
}
