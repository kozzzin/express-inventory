function checkPassword(pass) {
  if (pass === 'pass123') {
    console.log('good pass');
    return true;
  }
  return false;
}

module.exports = checkPassword;