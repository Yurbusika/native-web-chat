const loginForm = document.querySelector('#login-form');

if (!(loginForm instanceof HTMLFormElement)) {
  throw new Error('Login form not found');
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const username = formData.get('username');
  const password = formData.get('password');

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      alert(data.error);
    } else {
      window.location.href = '/chat';
    }
  })
  .catch(error => console.error('Error:', error));

});