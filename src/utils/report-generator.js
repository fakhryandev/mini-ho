const ExcelJS = require("exceljs");

const buildHeader = (maxPartsLength) => {
  const headers = [
    "Kode Erro",
    "Nomor",
    "Nama",
    "Nik",
    "Alamat",
    "Telepon",
    "Kota",
    "Noka",
    "Nosin",
    "KTP",
    "STNK"
  ];
  for (let i = 0; i < maxPartsLength; i++) {
    headers.push(`Part Number ${i + 1}`, `QTY ${i + 1}`);
  }

  return headers;
};

const buildRow = (item, maxPartsLength) => {
  const rowData = [
    item.erro,
    item.nomor,
    item.nama,
    item.nik,
    item.alamat,
    item.telepon,
    item.kota,
    item.noka,
    item.nosin,
    `localhost:3000/photos/${item.ktp.url}`,
    `localhost:3000/photos/${item.stnk.url}`,
  ];

  for (let i = 0; i < maxPartsLength; i++) {
    if (item.parts && item.parts[i]) {
      const partNumber = item.parts[i].partNumber
      const partQty = item.parts[i].qty
      rowData.push(partNumber, partQty);      
    }
  }

  return rowData;
};

const generator = (data) => {
  const maxPartsLength = Math.max(
    ...data.map((item) => item.parts && item.parts.length)
  );

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Request Part");

  worksheet.addRow(buildHeader(maxPartsLength));

  data.forEach((item) => {
    worksheet.addRow(buildRow(item, maxPartsLength));
  });

  return workbook;
};

module.exports = { generator };
