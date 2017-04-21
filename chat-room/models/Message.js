const db = require('../db');

module.exports = db.defineModel('message_list', {
  content: {
    type: db.STRING(2048),
    allowNull: false
  },
  username: {
    type: db.STRING(16),
    allowNull: false
  },
  type: {
    type: db.STRING(8),
    allowNull: false
  }
});
