const registrationForm = document.querySelector('#registration-form');

if (!(registrationForm instanceof HTMLFormElement)) {
  throw new Error('Registration form not found');
}

registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(registrationForm);
  const username = formData.get('username');
  const password = formData.get('password');

  fetch('/api/registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        window.location.href = '/chat';
      }
    })
    .catch((error) => console.error('Error:', error));
});