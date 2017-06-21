/*
* @Author: inksmallfrog
* @Date:   2017-06-21 15:54:14
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-06-21 17:06:47
* @Description: 获取应用环境
*/

'use strict';

const path = require('path');
let config = {
  dbEnv:{
    name: 'lifeManager',
    modelPath: path.join(__dirname, '../models'),
    db: 'lifeManager',
    username: 'root',
    password: '3345*moxiaowa',
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    timezone: '+08:00', //for writing to database
    logging: console.log,
    pool: {
      maxConnections: 10,
      minConnections: 0,
      maxIdleTime: 30000
    }
  },
  fileSysPath: 'dist'
}

module.exports = config;
