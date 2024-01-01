const registerForm = document.getElementById('requestForm');

document.addEventListener('DOMContentLoaded', function () {});

function showLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

const stnk = document.getElementById('stnk');
const ktp = document.getElementById('ktp');
stnk.addEventListener('change', function () {
  validateFile(stnk, 'stnk');
});

ktp.addEventListener('change', function () {
  validateFile(ktp, 'ktp');
});

document.getElementById('resetForm').addEventListener('click', function () {
  registerForm.reset();
});

document
  .getElementById('telepon')
  .addEventListener('keydown', function (event) {
    validateNumericInput(event);
  });

document.getElementById('nik').addEventListener('keydown', function (event) {
  validateNumericInput(event);
});

function validateNumericInput(event) {
  const keyCode = event.which || event.keyCode;

  if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) {
    event.preventDefault();
  }
}

registerForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const nomor = document.getElementById('nomor').value;
  const nik = document.getElementById('nik').value;
  const nama = document.getElementById('nama').value;
  const alamat = document.getElementById('alamat').value;
  const telepon = document.getElementById('telepon').value;
  const kota = document.getElementById('kota').value;
  const noka = document.getElementById('noka').value;
  const nosin = document.getElementById('nosin').value;
  const type = document.getElementById('type').value;
  const tahun = document.getElementById('tahun').value;
  const ktp = document.getElementById('ktp');
  const stnk = document.getElementById('stnk');

  const dynamicInputs = document.querySelectorAll(
    'input[id^="partnumber"], input[id^="qty"]'
  );

  const parts = [];
  dynamicInputs.forEach((input, index) => {
    const partIndex = Math.floor(index / 2);

    if (!parts[partIndex]) {
      parts[partIndex] = {};
    }

    parts[partIndex][input.id.includes('partnumber') ? 'partNumber' : 'qty'] =
      input.value.trim();
  });

  const data = {
    nomor,
    nik,
    nama,
    alamat,
    telepon,
    kota,
    noka,
    nosin,
    type,
    tahun,
    ktp,
    stnk,
    parts,
  };

  const { valid, message } = validateRequest(data);

  if (valid) {
    showLoadingOverlay();
    const { error, message } = await addRequest(data);
    const swalConfig = {
      icon: 'success',
      text: 'Berhasil menambah data.',
    };
    if (!error) {
      registerForm.reset();
    }
    if (error) {
      swalConfig.icon = 'error';
      swalConfig.text = message;
      console.error(message);
    }
    hideLoadingOverlay();
    Swal.fire(swalConfig);
  } else {
    const swalConfig = {
      icon: 'error',
      text: message,
    };
    Swal.fire(swalConfig);
  }
});

function findDuplicates(parts) {
  const valueCount = {};
  const duplicates = [];

  for (const value of parts) {
    if (valueCount[value] === undefined) {
      valueCount[value] = 1;
    } else {
      duplicates.push(value);
      valueCount[value]++;
    }
  }

  return duplicates;
}

function validateFile(fileInput, fileType) {
  const file = fileInput.files[0];

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    const swalConfig = {
      icon: 'error',
      text: `Hanya file ${fileType} dengan tipe JPG, JPEG, atau PNG yang diizinkan.`,
    };
    fileInput.value = '';

    return Swal.fire(swalConfig);
  }

  const maxSizeMB = 10;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    fileInput.value = '';
    const swalConfig = {
      icon: 'error',
      text: `Ukuran file ${fileType} terlalu besar. Maksimal ${maxSizeMB} MB.`,
    };

    return Swal.fire(swalConfig);
  }
}

function isStringEmptyOrWhitespace(inputString) {
  return inputString.trim() === '';
}

function validateRequest(data) {
  const result = {
    valid: true,
    message: '',
  };

  const {
    nomor,
    nik,
    nama,
    alamat,
    telepon,
    kota,
    noka,
    nosin,
    type,
    tahun,
    parts,
    stnk,
    ktp,
  } = data;

  if (isStringEmptyOrWhitespace(nomor)) {
    result.message = `${result.message} Nomor Kuitansi Hotline tidak boleh kosong,`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(nik)) {
    result.message = `${result.message} NIK tidak boleh kosong,`;
    result.valid = false;
  }

  if (!isStringEmptyOrWhitespace(nik) && nik.length !== 16) {
    result.message = `${result.message} NIK tidak sesuai,`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(nama)) {
    result.message = `${result.message} Nama tidak boleh kosong,`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(alamat)) {
    result.message = `${result.message} Alamat tidak boleh kosong,`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(telepon)) {
    result.message = `${result.message} Nomor Telepon tidak boleh kosong,`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(kota)) {
    result.message = `${result.message} Kota tidak boleh kosong,`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(noka)) {
    result.message = `${result.message} Nomor Rangka tidak boleh kosong,`;
    result.valid = false;
  }

  if (
    !isStringEmptyOrWhitespace(noka) &&
    (noka.length < 14 || noka.length > 16)
  ) {
    result.message = `${result.message} Nomor Rangka tidak sesuai,`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(nosin)) {
    result.message = `${result.message} Nomor Mesin tidak boleh kosong,`;
    result.valid = false;
  }

  if (
    !isStringEmptyOrWhitespace(nosin) &&
    (nosin.length < 12 || nosin.length > 13)
  ) {
    result.message = `${result.message} Nomor Mesin tidak sesuai,`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(type)) {
    result.message = `${result.message} Tipe Motor tidak boleh kosong,`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(tahun)) {
    result.message = `${result.message} Tahun Motor tidak boleh kosong,`;
    result.valid = false;
  }

  if (!parts.length) {
    result.message = `${result.message} Parts tidak boleh kosong.`;
    result.valid = false;
  }

  if (parts.length) {
    const partNumbers = parts.map((part) => part.partNumber);

    const everyPartNumberFill = partNumbers.every((part) => part.trim() !== '');

    if (!everyPartNumberFill) {
      result.message = `${result.message} Semua form part number harus diisi.`;
      result.valid = false;
    } else {
      const duplicateValues = findDuplicates(partNumbers);

      if (duplicateValues.length) {
        result.message = `${
          result.message
        } Ada part number yang duplikat ${duplicateValues.join(', ')}.`;
        result.valid = false;
      }

      const invalidQty = parts.find((part) => part.qty < 1);
      if (invalidQty) {
        result.message = `${result.message} Qty untuk Part Number ${invalidQty.partNumber} tidak boleh kurang dari 1.`;
        result.valid = false;
      }
    }
  }

  if (!stnk.files[0]) {
    result.message = `${result.message} Tidak file stnk yang diunggah, `;
    result.valid = false;
  }

  if (!ktp.files[0]) {
    result.message = `${result.message} Tidak file ktp yang diunggah`;
    result.valid = false;
  }

  return result;
}

async function addRequest(data) {
  const requestURL = 'api/request';
  const formData = new FormData();

  const {
    nomor,
    nik,
    nama,
    alamat,
    telepon,
    kota,
    noka,
    nosin,
    type,
    tahun,
    parts,
    ktp,
    stnk,
  } = data;

  formData.append('nomor', nomor);
  formData.append('nik', nik);
  formData.append('nama', nama);
  formData.append('alamat', alamat);
  formData.append('telepon', telepon);
  formData.append('kota', kota);
  formData.append('noka', noka);
  formData.append('nosin', nosin);
  formData.append('type', type);
  formData.append('tahun', tahun);
  formData.append('parts', JSON.stringify(parts));
  formData.append('ktp', ktp.files[0]);
  formData.append('stnk', stnk.files[0]);

  const response = await fetch(requestURL, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  return result;
}

document.getElementById('buttonAddPart').addEventListener('click', function () {
  addNewPartForm();
});

let formCounter = 2;
function addNewPartForm() {
  const container = document.getElementById('part-container');
  const formGroup = document.createElement('div');
  formGroup.className = 'row mt-3';

  const firstCol = document.createElement('div');
  firstCol.classList = 'col-md-4';

  const partNumberLabel = document.createElement('label');
  partNumberLabel.className = 'form-label';
  partNumberLabel.htmlFor = `partnumber${formCounter}`;
  partNumberLabel.innerHTML = 'Part Number';

  const partNumberInput = document.createElement('input');
  partNumberInput.type = 'text';
  partNumberInput.className = 'form-control';
  partNumberInput.id = `partnumber${formCounter}`;

  firstCol.appendChild(partNumberLabel);
  firstCol.appendChild(partNumberInput);

  const secondCol = document.createElement('div');
  secondCol.className = 'col-md-4';

  const partQtyLabel = document.createElement('label');
  partQtyLabel.className = 'form-label';
  partQtyLabel.htmlFor = `qty${formCounter}`;
  partQtyLabel.innerHTML = 'Qty';

  const partQtyInput = document.createElement('input');
  partQtyInput.type = 'number';
  partQtyInput.className = 'form-control';
  partQtyInput.id = `qty${formCounter}`;

  secondCol.appendChild(partQtyLabel);
  secondCol.appendChild(partQtyInput);

  const thirdCol = document.createElement('div');
  thirdCol.className = 'col-md-2 row align-items-end';

  const buttonDeletePart = document.createElement('button');
  buttonDeletePart.className = 'btn btn-danger btn-sm';
  buttonDeletePart.innerHTML = 'Hapus';
  buttonDeletePart.onclick = function () {
    removeInput(formGroup);
  };

  thirdCol.appendChild(buttonDeletePart);

  formGroup.appendChild(firstCol);
  formGroup.appendChild(secondCol);
  formGroup.appendChild(thirdCol);

  container.appendChild(formGroup);

  formCounter++;
}

function removeInput(formGroup) {
  const container = document.getElementById('part-container');
  container.removeChild(formGroup);
}
