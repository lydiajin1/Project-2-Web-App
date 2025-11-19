const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/recipes' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/recipes' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const changePasswordPage = (req, res) => res.render('changePassword');

const changePassword = async (req, res) => {
  const oldPass = `${req.body.oldPassword}`;
  const newPass = `${req.body.newPassword}`;
  const newPass2 = `${req.body.newPassword2}`;

  if (!oldPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'New passwords do not match!' });
  }

  return Account.authenticate(req.session.account.username, oldPass, async (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Current password is incorrect!' });
    }

    try {
      const hash = await Account.generateHash(newPass);
      await Account.findByIdAndUpdate(req.session.account._id, { password: hash });
      return res.json({ message: 'Password changed successfully!' });
    } catch (updateErr) {
      console.log(updateErr);
      return res.status(500).json({ error: 'An error occurred changing password!' });
    }
  });
};

const upgradeToPremium = async (req, res) => {
  try {
    await Account.findByIdAndUpdate(req.session.account._id, { isPremium: true });
    req.session.account.isPremium = true;
    return res.json({ message: 'Upgraded to premium successfully!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred upgrading account!' });
  }
};

const getAccountInfo = (req, res) => res.json({
  username: req.session.account.username,
  isPremium: req.session.account.isPremium || false,
});

module.exports = {
  loginPage,
  logout,
  login,
  signup,
  changePasswordPage,
  changePassword,
  upgradeToPremium,
  getAccountInfo,
};
