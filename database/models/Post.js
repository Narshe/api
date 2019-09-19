let Model = require('./Model');
let moment = require('../../configs/moment/fr');
let User = require('./User');

class Post extends Model
{
    
    constructor(row = null) {
        super();
        this.table = 'posts'

        row !== null && this.hydrate(row)
      
    }

    postsWithUser() {

        return this.db.query(`SELECT p.id, p.user_id, p.title, p.content, p.created_at, p.updated_at, 
            JSON_OBJECT('name', u.name, 'email', u.email, 'id', u.id) as user
            FROM ${this.table} p 
            LEFT JOIN users u ON p.user_id = u.id `
        );
    }   

    findBy(field, value) {

        return this.db.query(`SELECT p.id, p.user_id, p.title, p.content, p.created_at, p.updated_at,
            JSON_OBJECT('name', u.name, 'email', u.email, 'id', u.id) as user
            FROM ${this.table} p
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.${field}=?`,
            [value]
        )
    }

    save() {

        return this.db.query(`INSERT INTO ${this.table} (user_id, title, content, created_at, updated_at) VALUES(?,?,?,?,?)`, 
        [
            this.user.id,
            this._title, 
            this._content,
            this._created_at,
            this._updated_at
        ]);

    }
    
    destroy() {

        return this.db.query(`DELETE FROM ${this.table} WHERE id=?`,[this.id]);
    }

    formatedValues() {

        return {
            id: this.id,
            user: {id: this.user.id, name: this.user.name },
            comments: this.comments ? this.comments.map((comment) => comment.formatedValues()) : [],
            title: this.title,
            content: this.content,
            created_at: this.created_at,
            updated_at: this.updated_at
        }

    }

    set id(id) { this._id = id; }

    set user(user) { 

        if (typeof user === "string" )
        user = JSON.parse(user);

        this._user = new User(user); 
    }

    set comments(comments) { 
        
        const Comment = require('./Comment');
        this._comments = comments.map((comment) => {
            return new Comment(comment)
            
        })
        console.log("tiggered comment");
    }

    set title(title) { this._title = title; }
    set content(content) { this._content = content; }
    set created_at(created_at) { this._created_at = created_at; }
    set updated_at(updated_at) { this._updated_at = updated_at; }

    get id() { return this._id; }
    get comments() { return this._comments }
    get user() { return this._user }
    get title() { return this._title; }
    get content() { return this._content; }
    get created_at() { return moment(this._created_at).fromNow(); }
    get updated_at() { return moment(this._updated_at).fromNow(); }

    
}


module.exports = Post;