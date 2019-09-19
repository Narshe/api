const Model = require('./Model');
const bcrypt = require('bcrypt');


class User extends Model
{
    constructor(row = null) {

        super();
        this.table = 'users';
        
        row !== null && this.hydrate(row)
    }

    findBy(field, value) {
        
        return this.db.query(`SELECT * FROM ${this.table} WHERE ${field}=? LIMIT 1`, [value]);
    }
   

    async save() {

        return this.db.query(`INSERT INTO ${this.table} (name, password, email) VALUES(?,?,?)`, 
        [
            this.name, 
            await this.hashPassword(), 
            this.email
        ]);
    }

    formatedValues() {

        return {
            name: this.name,
            email: this.email,
            posts: this.posts ? this.posts.map((post) => post.formatedValues()) : []
        }
    }

    hashPassword() {

        const saltRounds = 10;

        return bcrypt.hash(this.password, saltRounds).then((hash) => hash)

    }
    
    checkPassword(formPassword) {
 
        return bcrypt.compare(formPassword, this.password);
    }

    set id(id) { this._id = id; }
    set name(name) { this._name = name; }
    set posts(posts) {

        const Post = require('./Post');
        this._posts = posts.map((post) => {
            return new Post(post)
        })

    }

    set password(password) { this._password = password; }
    set email(email) { this._email = email; }

    get id() { return this._id; }
    get posts() { return this._posts }
    get name() { return this._name;  }
    get password() { return this._password; }
    get email() { return this._email; }
}


module.exports = User;