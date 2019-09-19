let Database = require('../db');

class Model 
{
    constructor() {

        this.db = new Database();
        this.table = null
    }

    hydrate(row) {

        for (let prop in row) {

            this[prop] = row[prop];
        }
      
        return this;
    }
    
    all() {

         return this.db.query(`SELECT * FROM ${this.table}`);
    }

    findById(id) {

         return this.db.query(`SELECT * FROM ${this.table} WHERE id=? LIMIT 1`, [id]);
    }
    
    delete(id) {

        return this.db.query(`DELETE FROM ${this.table} WHERE id=?`, [id]);
    }
}


module.exports = Model;