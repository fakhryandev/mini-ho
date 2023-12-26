document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;
  const username = path.split('/')[3];

  getUserData(username).then((res) => {
    const { data } = res;

    loadUsertoForm(data);
  });
});
const baseUrl = 'http://localhost:3000';
const userUrl = `${baseUrl}/api/user`;

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

  const { erro, nama, username, password } = data;
  if (isStringEmptyOrWhitespace(erro)) {
    result.message = `${result.message} Kode Erro tidak boleh kosong.`;
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

  if (isStringEmptyOrWhitespace(password)) {
    result.message = `${result.message} Password tidak boleh kosong.`;
    result.valid = false;
  }

  return result;
}

updateUserForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const erro = document.getElementById('erro').value;
  const nama = document.getElementById('nama').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const data = {
    erro,
    nama,
    username,
    password,
  };

  const { valid, message: validatorMessage } = validateRegister(data);

  if (valid) {
    const result = await update(data);

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
  }
  else{
    const swalConfig = {
      icon: 'error',
      text: validatorMessage,
    };
    Swal.fire(swalConfig);
  }
});

async function getUserData(username) {
  try {
    showLoadingOverlay();
    const requestURL = `${userUrl}/${username}`;

    const response = await fetch(requestURL);
    const result = await response.json();

    hideLoadingOverlay();

    return result;
  } catch (error) {
    hideLoadingOverlay();
    console.error(error);
  }
}

async function update(data) {
  showLoadingOverlay();

  const resposne = await fetch(`${userUrl}/${data.username}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await resposne.json();
  hideLoadingOverlay();

  return result;
}

function loadUsertoForm(user) {
  document.getElementById('erro').value = user.erro;
  document.getElementById('nama').value = user.name;
  document.getElementById('username').value = user.username;
}
