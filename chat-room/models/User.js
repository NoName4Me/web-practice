const db = require('../db');

module.exports = db.defineModel('users', {
  username: {
    type: db.STRING(32),
    allowNull: false,
    unique: true
  },
  nickname: {
    type: db.STRING(32),
    allowNull: false
  },
  password: {
    type: db.STRING(16),
    allowNull: false
  },
  avatar: db.STRING(256),
  online: db.BOOLEAN(1)
});
