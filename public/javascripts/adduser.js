document.addEventListener('DOMContentLoaded', function () {
  
});
const baseUrl = 'http://localhost:3000';
const userUrl = `${baseUrl}/api/user`;

const registerForm = document.getElementById('registerForm');

function showLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

registerForm.addEventListener('submit', async function (e) {
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

  register(data);
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

  const { error, message } = result;

  const swalConfig = {
    icon: 'success',
    text: message,
  };

  if (error) {
    swalConfig.icon = 'error';
    swalConfig.text = message;
  }

  hideLoadingOverlay();
  Swal.fire(swalConfig);
}
