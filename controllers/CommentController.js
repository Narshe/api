let Comment = require('../database/models/Comment');
let User = require('../database/models/User');

class CommentController 
{   

    index(req, res) {

        let comment = new Comment();
        let comments = [];

        comment.findWithUser(req.params.id, req.params.limit)
            .then((rows) => {

                console.log(rows);
                comments = rows.map((row) => new Comment(row).formatedValues());
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(_ => {
                
                return res.json(comments);
            })
    }

   create(req, res) {
        
        let u = new User();

        u.findById(req.user.id)
            .then((user) => {
            let content = req.body.content;
            let post_id = req.body.post_id;

            if (post_id == null|| content === '' ) {
                return res.status(406).send('Not Acceptable');
            }
            
            let comment = new Comment();
            
            comment.hydrate({
                content: content,
                user: user[0],
                post: {id: post_id},
                created_at: new Date(),
                updated_at: new Date()
            });
            
            
            comment.save()
                .then((c) => {
                    
                    comment.id = c.insertId;

                    return res.json(comment.formatedValues());
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(406).send('Not Acceptable');
                })
         
        }).catch((err) => {
            console.log(err);
            return res.status(404).send('User not found');
        })
  
   }

   destroy(req, res) {


        let comment = new Comment();

        comment.findById(req.params.id)

            .then((rows) => {
                
                comment.id = rows[0].id;
                comment.user = {id: rows[0].user_id};

                if (comment.user.id !== req.user.id) return res.status(403).send('Wrong user');
                
                comment.destroy()
                    .then((row) => {

                        return res.json({
                            message: "Deleted"
                        });
                    })
                    .catch((err) => {
                        return res.status(406).send(err);
                    })
            
            })         
            .catch((err) => {
                return res.status(406).send('Ce post n\'existe pas');
            })
    
   }
}

module.exports = CommentController;