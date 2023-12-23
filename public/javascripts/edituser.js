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

  update(data);
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

function loadUsertoForm(user) {
  document.getElementById('erro').value = user.erro;
  document.getElementById('nama').value = user.name;
  document.getElementById('username').value = user.username;
}
