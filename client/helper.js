const handleError = (message) => {
  const errorElement = document.getElementById('errorMessage');
  const errorContainer = document.getElementById('errorContainer');
  if (errorElement) {
    errorElement.textContent = message;
  }
  if (errorContainer) {
    errorContainer.classList.remove('hidden');
  }
};

const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  const errorContainer = document.getElementById('errorContainer');
  if (errorContainer) {
    errorContainer.classList.add('hidden');
  }

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  if (handler) {
    handler(result);
  }
};

const hideError = () => {
  const errorContainer = document.getElementById('errorContainer');
  if (errorContainer) {
    errorContainer.classList.add('hidden');
  }
};

module.exports = {
  handleError,
  sendPost,
  hideError,
};