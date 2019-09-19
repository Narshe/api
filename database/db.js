const Promise = require("bluebird");
const getSqlConnection = require('./databaseConnection');

class NotFoundException extends Error {

    constructor(message = null) {
        super()
        this.message = message || "Pas de résultat trouvé"
    }
}

class Database {


    constructor() {

        this.query = this.query.bind(this);
    }

    query(q, params = []) {

        return Promise.using(getSqlConnection(), (connection) => {
 
            return connection.query(q, params)
                .then((rows) => {
                    if (rows.length <= 0) throw new NotFoundException()
                    return rows;
                })
            ;
            
        })
    }

}

module.exports = Database;