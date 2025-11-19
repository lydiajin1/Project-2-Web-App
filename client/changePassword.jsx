const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handlePasswordChange = (e) => {
  e.preventDefault();
  helper.hideError();

  const oldPassword = e.target.querySelector('#oldPassword').value;
  const newPassword = e.target.querySelector('#newPassword').value;
  const newPassword2 = e.target.querySelector('#newPassword2').value;

  if (!oldPassword || !newPassword || !newPassword2) {
    helper.handleError('All fields are required!');
    return false;
  }

  if (newPassword !== newPassword2) {
    helper.handleError('New passwords do not match!');
    return false;
  }

  helper.sendPost(e.target.action, { oldPassword, newPassword, newPassword2 }, (result) => {
    if (result.message) {
      helper.handleError('Password changed successfully! Redirecting...');
      setTimeout(() => {
        window.location = '/login';
      }, 2000);
    }
  });

  return false;
};

const ChangePasswordWindow = (props) => {
  return (
    <form id="changePasswordForm"
      name="changePasswordForm"
      onSubmit={handlePasswordChange}
      action="/changePassword"
      method="POST"
      className="mainForm"
    >
      <h3>Change Password</h3>
      <label htmlFor="oldPassword">Current Password: </label>
      <input id="oldPassword" type="password" name="oldPassword" placeholder="current password" />
      <label htmlFor="newPassword">New Password: </label>
      <input id="newPassword" type="password" name="newPassword" placeholder="new password" />
      <label htmlFor="newPassword2">Confirm New Password: </label>
      <input id="newPassword2" type="password" name="newPassword2" placeholder="confirm new password" />
      <input className="formSubmit" type="submit" value="Change Password" />
      <a href="/recipes" className="backLink">Back to Recipes</a>
    </form>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('content'));
  root.render(<ChangePasswordWindow />);
};

window.onload = init;
