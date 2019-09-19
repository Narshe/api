let Model = require('./Model');
let moment = require('../../configs/moment/fr');
let User = require('./User');
let Post = require('./Post');

class Comment extends Model
{
    
    constructor(row = null) {
        super();
        this.table = 'comments'

        console.log(row);
        row !== null && this.hydrate(row)
    }


    findWithUser(post_id, limit) {

        limit = (limit !== 'all' && limit > 0) ? `LIMIT ${limit}` : '';

        return this.db.query(`SELECT c.id, c.content, c.created_at, c.updated_at,
            JSON_OBJECT('name', u.name, 'id', u.id) as user
            FROM ${this.table} c
            LEFT JOIN users u 
            ON u.id = c.user_id
            WHERE post_id=?
            ORDER BY c.created_at ASC
            ${limit}`
            ,
            [post_id]
        )
    }

    findByPost(post_id) {

        return this.db.query(`SELECT * FROM ${this.table} WHERE post_id=?`,[post_id]);
    }

    save() {

        return this.db.query(`INSERT INTO ${this.table} (content, created_at, updated_at, post_id, user_id) VALUES(?,?,?,?,?)`, 
        [    
            this._content,
            this._created_at,
            this._updated_at,
            this.post.id,
            this.user.id
        ]);

    }
    
    destroy() {

        return this.db.query(`DELETE FROM ${this.table} WHERE id=?`,[this.id])
    }

    multipleDestroy(ids) {

        let IN = ids.map( _ => '?').join(',');

        return this.db.query(`DELETE FROM ${this.table} WHERE id IN (${IN})`, ids);
    }   

    formatedValues() {

        console.log("POST: " + this.post);

        return {
            id: this.id,
            user: {id: this.user.id, name: this.user.name},
            content: this.content,
            created_at: this.created_at,
            updated_at: this.updated_at,
        }

    }

    set id(id) { this._id = id; }

    set user(user) { 

        if (typeof user === "string")
        user = JSON.parse(user);

        this._user = new User(user); 

    }

    set content(content) { this._content = content; }
    set created_at(created_at) { this._created_at = created_at; }
    set updated_at(updated_at) { this._updated_at = updated_at; }

    get id() { return this._id; }
    get user() { return this._user }
    get post() {return this._post }
    get content() { return this._content; }
    get created_at() { return moment(this._created_at).fromNow(); }
    get updated_at() { return this._updated_at; }

    
}


module.exports = Comment;