const Sequelize = require('sequelize');

const config = require('./configs/config');

console.log('init sequelize...');


var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

function defineModel(name, attributes) {
  var attrs = {};
  for (let key in attributes) {
    let value = attributes[key];
    if (typeof value === 'object' && value['type']) {
      value.allowNull = value.allowNull || false;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
        allowNull: true
      };
    }
  }
  attrs.id = {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  };

  attrs.createdAt = {
    type: Sequelize.BIGINT,
    allowNull: false
  };
  attrs.updatedAt = {
    type: Sequelize.BIGINT,
    allowNull: false
  };
  attrs.version = {
    type: Sequelize.BIGINT,
    allowNull: false
  };
  console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function(k, v) {
    if (k === 'type') {
      for (let key in Sequelize) {
        if (key === 'ABSTRACT' || key === 'NUMBER') {
          continue;
        }
        let dbType = Sequelize[key];
        if (typeof dbType === 'function') {
          if (v instanceof dbType) {
            if (v._length) {
              return `${dbType.key}(${v._length})`;
            }
            return dbType.key;
          }
          if (v === dbType) {
            return dbType.key;
          }
        }
      }
    }
    return v;
  }, '  '));
  return sequelize.define(name, attrs, {
    tableName: name,
    timestamps: false,
    hooks: {
		beforeBulkUpdate: function(options){
			options.individualHooks = true;
		},
      beforeCreate: function(obj) {
        let now = Date.now();
        console.log('will create entity...', obj);
        obj.createdAt = now;
        obj.updatedAt = now;
        obj.version = 0;
      },
      beforeUpdate: function(obj) {
        let now = Date.now();
        console.log('will update entity...');
        obj.updatedAt = now;
        obj.version++;
      }
    }
  });
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

var exp = {
  defineModel: defineModel,
  sync: () => {
    // only allow create ddl in non-production environment:
    if (process.env.NODE_ENV !== 'production') {
      sequelize.sync({
        force: true
      });
    } else {
      throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
    }
  }
};

for (let type of TYPES) {
  exp[type] = Sequelize[type];
}

module.exports = exp;
