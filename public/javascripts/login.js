const authURL = 'api/auth';

function showLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const data = {
    username,
    password,
  };

  login(data);
});

async function login(data) {
  try {
    const loginUrl = `${authURL}/login`;
    showLoadingOverlay();
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      window.location.href = '/';
    } else {
      const swalConfig = {
        icon: 'error',
        text: result.message,
      };
      hideLoadingOverlay();

      Swal.fire(swalConfig);
    }
  } catch (error) {
    console.error(error);
  }
}
