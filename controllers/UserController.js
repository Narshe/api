let User = require('../database/models/User');
let Post = require('../database/models/Post');
let jwt = require('jsonwebtoken');
let secret = 'd41d8cd98f00b204e9800998ecf8427e';

class UserController 
{

  authenticate(req, res, next) {

    let user = new User();
    let {name, password} = req.body;

    user.findBy('name', name)
      .then((rows) => {

        user.hydrate(rows[0]);

        user.checkPassword(password)
          .then((authorized) => {

            if(!authorized) return res.status(406).send('Mot de passe incorrect');
          
            const payload =  {id: user.id, name: user.name};
            const token = jwt.sign({payload}, secret, {
              expiresIn: '1h',
            });
            
            res.cookie('token', token, { httpOnly: true })
              .json({
                  id: user.id,
                  name: user.name
              })
          })    
      })
      .catch((err) => {
        console.log(err);
        return res.status(406).send('Utilisateur introuvable');
      })
  }

  logout(req, res) {

    return res.clearCookie("token").status(200).send("Logout");
  }

  show(req, res, next) {

    let user = new User();

    user.findById(req.params.id)
      .then((rows) => {

          user.hydrate(rows[0]);
          return res.json(user.formatedValues());
      })
      .catch((err) => {
          return res.status(404).send('Utilisateur introuvable');
      })
   }

  profile(req, res) {

    let user = new User();

    user.findById(req.user.id)
      .then((rows) => {

          user.hydrate(rows[0]);

          let post = new Post();

          post.findBy('user_id', user.id)
            .then((posts) => {
              
              user.posts = posts;
            })
            .catch((err) => {
              user.posts = [];
            })
            .finally(() => {
              res.json(user.formatedValues());
            })


      })
      .catch((err) => {
        console.log(err);
        return res.status(404).send('Utilisateur introuvable');
      })
   }


  create(req, res) {

    let user = new User();

    user.name = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;

    user.save()
        .then((user) => {
            return res.json({
              id: user.insertId,
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send('Erreur durant de l\'inscription');
        })
    }
}

module.exports = UserController;