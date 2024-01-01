document.addEventListener('DOMContentLoaded', function () {});
const baseUrl = 'http://localhost:3000';
const userUrl = `${baseUrl}/api/user`;

const registerForm = document.getElementById('registerForm');

function isUsernameLengthValid(username) {
  return username.length >= 4 && username.length <= 20;
}

function isUsernameValidChars(username) {
  const validCharsRegex = /^[a-zA-Z0-9_]+$/;
  return validCharsRegex.test(username);
}

function isPasswordLengthValid(password) {
  return password.length >= 8 && password.length <= 20;
}

function showLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

document.getElementById('cancelButton').addEventListener('click', function () {
  window.location = '/user';
});

function isStringEmptyOrWhitespace(inputString) {
  return inputString.trim() === '';
}

function validateRegister(data) {
  const result = {
    valid: true,
    message: '',
  };

  const { erro, nama, username, password, kode3, kodeax5, kodeax9, ahass } =
    data;
  if (isStringEmptyOrWhitespace(erro)) {
    result.message = `${result.message} Kode Erro tidak boleh kosong.`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(kode3)) {
    result.message = `${result.message} Kode 3 tidak boleh kosong.`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(kodeax5)) {
    result.message = `${result.message} Kode AX 5 tidak boleh kosong.`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(kodeax9)) {
    result.message = `${result.message} Kode AX 9 tidak boleh kosong.`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(ahass)) {
    result.message = `${result.message} Nomor Ahass tidak boleh kosong.`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(nama)) {
    result.message = `${result.message} Nama tidak boleh kosong.`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(username)) {
    result.message = `${result.message} Username tidak boleh kosong.`;
    result.valid = false;
  }

  if (
    !isStringEmptyOrWhitespace(username) &&
    !isUsernameLengthValid(username)
  ) {
    result.message = `${result.message} Username harus memiliki panjang antara 4 dan 20 karakter.`;
    result.valid = false;
  }

  if (!isStringEmptyOrWhitespace(username) && !isUsernameValidChars(username)) {
    result.message = `${result.message} Username hanya boleh terdiri dari huruf, angka, dan garis bawah.`;
    result.valid = false;
  }

  if (isStringEmptyOrWhitespace(password)) {
    result.message = `${result.message} Password tidak boleh kosong.`;
    result.valid = false;
  }

  if (
    !isStringEmptyOrWhitespace(password) &&
    !isPasswordLengthValid(password)
  ) {
    result.message = `${result.message} Password harus memiliki panjang antara 8 dan 20 karakter.`;
    result.valid = false;
  }

  return result;
}

registerForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const erro = document.getElementById('erro').value;
  const nama = document.getElementById('nama').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const kode3 = document.getElementById('kode3').value;
  const kodeax5 = document.getElementById('kodeax5').value;
  const kodeax9 = document.getElementById('kodeax9').value;
  const ahass = document.getElementById('ahass').value;

  const data = {
    erro,
    nama,
    username,
    password,
    kode3,
    kodeax5,
    kodeax9,
    ahass,
  };

  const { valid, message: validatorMessage } = validateRegister(data);

  if (valid) {
    const result = await register(data);
    const { error, message } = result;

    if (error) {
      const swalConfig = {
        icon: 'error',
        text: message,
      };
      Swal.fire(swalConfig);
    } else {
      const swalConfig = {
        icon: 'success',
        text: message,
      };
      Swal.fire(swalConfig).then(() => {
        window.location = '/user';
      });
    }
  } else {
    const swalConfig = {
      icon: 'error',
      text: validatorMessage,
    };
    Swal.fire(swalConfig);
  }
});

async function register(data) {
  showLoadingOverlay();

  const response = await fetch(userUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  hideLoadingOverlay();

  return result;
}
