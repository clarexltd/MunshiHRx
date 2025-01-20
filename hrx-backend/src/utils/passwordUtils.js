const crypto = require("crypto");

const hashPassword = (password, name, id) => {
  const salt = `${name}${id}`;
  const iterations = 600000;
  const keylen = 64; // 512 bits
  const digest = "sha512";

  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
  return hash.toString("hex");
};

const verifyPassword = (inputPassword, name, id, storedHash) => {
  const inputHash = hashPassword(inputPassword, name, id);
  return inputHash === storedHash;
};

module.exports = { hashPassword, verifyPassword };