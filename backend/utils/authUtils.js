const bcrypt = require('bcryptjs');

// Hash the password before saving
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Adjust the salt rounds as needed
  return bcrypt.hash(password, salt);
};

// Compare the password provided with the hashed password
const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePasswords
};
