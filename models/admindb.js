const database = require('./database')

class admindb {
    constructor(){
        global.db = database;
    }
}

module.exports = admindb;