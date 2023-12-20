const registerForm = document.getElementById('requestForm');

document.addEventListener('DOMContentLoaded', function () {
  $('#parts').tokenfield({
    delimiter: ';',
    createTokensOnBlur: true,
  });
});

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
  const parts = document.getElementById('parts').value;
  const ktp = document.getElementById('ktp');
  const stnk = document.getElementById('stnk');

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
    parts,
    ktp,
    stnk,
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
      $('#parts').tokenfield('setTokens', []);
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

  if (isStringEmptyOrWhitespace(nosin)) {
    result.message = `${result.message} Nomor Hotline tidak boleh kosong,`;
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

  if (isStringEmptyOrWhitespace(parts)) {
    result.message = `${result.message} Parts tidak boleh kosong.`;
    result.valid = false;
  }

  if (!isStringEmptyOrWhitespace(parts)) {
    const partsSplitted = parts
      .split(';')
      .map((item) => item.trim())
      .filter((item) => item != '');

    const duplicateValues = findDuplicates(partsSplitted);

    if (duplicateValues.length) {
      result.message = `${
        result.message
      } Ada part number yang duplikat ${duplicateValues.join(', ')}.`;
      result.valid = false;
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
  formData.append('parts', parts);
  formData.append('ktp', ktp.files[0]);
  formData.append('stnk', stnk.files[0]);

  const response = await fetch(requestURL, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  return result;
}
