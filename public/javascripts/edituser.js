document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;
  const username = path.split('/')[3];

  getUserData(username).then((res) => {
    const { data } = res;
    
    loadUsertoForm(data)
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

function loadUsertoForm(user){
    document.getElementById('erro').value = user.erro
    document.getElementById('nama').value = user.name;
    document.getElementById('username').value = user.username;
}