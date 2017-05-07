/*
* @Author: inksmallfrog
* @Date:   2017-05-07 15:59:52
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-07 17:24:03
*/

'use strict';
module.exports = (sequelize, types)=>{
  let User = sequelize.define('User', {
    email: {
      type: types.STRING(80),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    psd: {
      type: types.STRING(80),
      allowNull: false,
      validate: {
        min: 6
      }
    },
    name: {
      type: types.STRING(80),
      defaultValue: '新用户'
    },
    favicon:{
      type: types.STRING(80),
      defaultValue: '/favicons/default.jpg'
    },
    des: {
      type: types.STRING(140),
      allowNull: true
    }
  }, {
    tableName: 'appUser'
  });
  User.associate = (models)=>{
    User.hasMany(models.TodoCategory, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Passage, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'commenterId'
    });
  };
  return User;
}
