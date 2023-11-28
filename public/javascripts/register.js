document.addEventListener('DOMContentLoaded', function () {});
const authURL = 'api/auth';

const registerForm = document.getElementById('registerForm');

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
  const registerUrl = `${authURL}/sign-up`;
  const response = await fetch(registerUrl, {
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

  Swal.fire(swalConfig);
}
