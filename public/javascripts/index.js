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

function flatPickBuilder(item) {
  const {selector, type} = item
  const defaultDate = type === 'current' ? new Date() : new Date(new Date().getFullYear(), new Date().getMonth(), 1)

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

  generateReport(startDate, endDate);
});

document.getElementById('search').addEventListener('click', function () {
  const startDate = document.getElementById('tanggalAwal').value;
  const endDate = document.getElementById('tanggalAkhir').value;
  getRequestParts(startDate, endDate);
});

function gridBuilder(data) {
  const gridContainer = document.getElementById('grid');
  gridContainer.innerHTML = '';

  const grid = new gridjs.Grid({
    columns: [
      {
        name: 'Action',
        formatter: (cell, row) => {
          return gridjs.h(
            'button',
            {
              className: 'btn btn-primary',
              onClick: () => console.log(row),
            },
            'Detail'
          );
        },
      },
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
    const requestURL = `api/request/generate-report?startDate=${startDate}&endDate=${endDate}`;
    const response = await fetch(requestURL);

    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition.split('filename=')[1];
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'file.xlsx';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error(error.message);
  }
}

async function getRequestParts(startDate, endDate) {
  const requestURL = `api/request?startDate=${startDate}&endDate=${endDate}`;
  const response = await fetch(requestURL);
  const result = await response.json();

  gridBuilder(result);
}
