document.addEventListener("DOMContentLoaded", async function () {
  const flatPickSelector = ["tanggalAwal", "tanggalAkhir"];

  flatPickSelector.map((selector) => flatPickBuilder(selector));

  const data = [];
  gridBuilder(data);
});

function flatPickBuilder(selector) {
  flatpickr(`#${selector}`, {
    dateFormat: "d-m-Y",
    allowInput: true,
    defaultDate: new Date(),
  });
}

document.getElementById("add").addEventListener("click", function () {
  window.location = "/add";
});

document.getElementById("report").addEventListener("click", function () {
  console.log("a");
});

document.getElementById("search").addEventListener("click", function () {
  const startDate = document.getElementById("tanggalAwal").value;
  const endDate = document.getElementById("tanggalAkhir").value;
  getRequestParts(startDate, endDate);
});

function gridBuilder(data) {
  const gridContainer = document.getElementById("grid");
  gridContainer.innerHTML = "";

  const grid = new gridjs.Grid({
    columns: [
      {
        name: "Action",
        formatter: (cell, row) => {
          return gridjs.h(
            "button",
            {
              className: "btn btn-primary",
              onClick: () => console.log(row),
            },
            "Detail"
          );
        },
      },
      {
        id: "nomor",
        name: "Nomor Hotline",
      },
      {
        id: "nik",
        name: "KTP",
      },
      {
        id: "nama",
        name: "Nama",
      },
      {
        id: "noka",
        name: "Nomor Rangka",
      },
      {
        id: "nosin",
        name: "Nomor Mesin",
      },
      {
        id: "type",
        name: "Type Motor",
      },
      {
        id: "tahun",
        name: "Tahun Motor",
      },
      {
        id: "create_at",
        name: "Tanggal Permintaan",
      },
    ],
    pagination: true,
    data: data,
  });

  grid.render(gridContainer).forceRender();

  return grid;
}

async function getRequestParts(startDate, endDate) {
  const requestURL = `api/request?startDate=${startDate}&endDate=${endDate}`;
  const response = await fetch(requestURL);
  const result = await response.json();

  console.log(result);

  gridBuilder(result);
}
