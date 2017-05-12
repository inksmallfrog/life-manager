/*
* @Author: inksmallfrog
* @Date:   2017-05-07 15:39:16
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-12 08:39:01
*/

'use strict';
const path = require('path');
module.exports = {
  name: 'lifeManager',
  modelPath: path.join(__dirname, '../models'),
  db: 'lifeManager',
  username: 'youruser',
  password: 'yourpassword',
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  timezone:'+08:00',
  logging: console.log,
  pool: {
    maxConnections: 10,
    minConnections: 0,
    maxIdleTime: 30000
  }
}
