const ExcelJS = require('exceljs');

const buildHeader = (maxPartsLength) => {
  const headers = [
    'Timestamp',
    'Kode Erro',
    'Nomor',
    'Nama',
    'Alamat',
    'Kota',
    'Telepon',
    'Nomor Rangka',
    'Nomor Mesin',
    'Type Motor',
    'Tahun Motor',
    'File KTP',
    'File STNK',
    'File Kuitansi'
  ];
  for (let i = 0; i < maxPartsLength; i++) {
    headers.push(`Part Number ${i + 1}`, `QTY ${i + 1}`);
  }

  return headers;
};

const buildRow = (item, maxPartsLength) => {
  const formatedDate = item.create_at
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    })
    .replace(',', '');

  const rowData = [
    formatedDate,
    item.erro,
    item.nomor_request,
    item.nama,
    item.alamat,
    item.kota,
    item.telepon,
    item.noka.toUpperCase(),
    item.nosin,
    item.type,
    item.tahun,
    `localhost:3000/photos/${item.ktp.url}`,
    `localhost:3000/photos/${item.stnk.url}`,
    `localhost:3000/photos/${item.kuitansi.url}`,

  ];

  for (let i = 0; i < maxPartsLength; i++) {
    if (item.parts && item.parts[i]) {
      const partNumber = item.parts[i].partNumber.toUpperCase();
      const partQty = item.parts[i].qty;
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
  const worksheet = workbook.addWorksheet('Request Part');

  worksheet.addRow(buildHeader(maxPartsLength));

  data.forEach((item) => {
    worksheet.addRow(buildRow(item, maxPartsLength));
  });

  return workbook;
};

module.exports = { generator };
