let Post = require('../database/models/Post');
let User = require('../database/models/User');
let Comment = require('../database/models/Comment');

class PostController 
{

   index(req, res) {

        let post = new Post();
        post.postsWithUser()
            .then((rows) => {

                let posts = rows.map((row) => new Post(row).formatedValues())

                return res.json(posts);
            })
            .catch((err) => {
                console.log(err);
                return res.status(406).send(err);
            })
   }

   show(req, res) {

        let post = new Post();

        post.findBy('id', req.params.id)
            .then((rows) => {
                
                post.hydrate(rows[0]);

                return res.json(post.formatedValues());
            })
            .catch((err) => {
                console.log(err.message);
                console.log(err.constructor.name);
                return res.status(404).send('Cet article n\'existe pas');
            });
   }

   create(req, res) {
        
        let u = new User();

        u.findById(req.user.id)
        .then((user) => {

            let title = req.body.title;
            let content = req.body.content;
        
            if (title === '' || content === '' ) {
                return res.status(406).send('Not Acceptable');
            }
            
            let post = new Post({
                title: title,
                content: content,
                user: user[0],
                created_at: new Date(),
                updated_at: new Date()
            });

            
            post.save()
                .then((post) => {
    
                    return res.json({
                        id: post.insertId,
                    });
    
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(406).send('Not Acceptable');
                })
         
        })
        .catch((err) => {
            console.log(err);
            return res.status(406).send('User not found');
        })
  
   }

   destroy(req, res) {

        let post = new Post();
        let comment  = new Comment();

        post.findBy('id', req.params.id)
            .then((rows) => {

                post.hydrate(rows[0]);

                if (post.user.id !== req.user.id) return res.status(403).send('Wrong user');
                
                comment.findByPost(post.id)
                    .then((rows) => {
                            let ids = rows.map((row) => row.id);      
                            comment.multipleDestroy(ids);
                        })
                    .catch((err) => console.log(err))

                post.destroy()
                    .then((rows) => {

                        return res.json({
                            message: "Deleted"
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(406).send(err);
                    })
            })
            .catch((err) => {
                console.log(err);
                return res.status(406).send('Ce post n\'existe pas');
            })
    
   }
}

module.exports = PostController;