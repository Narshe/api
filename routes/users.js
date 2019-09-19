let express = require('express');
let router = express.Router();
var authorize = require('../middlewares/authorize');

let UserController = require('../controllers/UserController');

const userController = new UserController();

/* GET users listing. */


router.get('/api/checkToken', authorize, function(req, res) {
  res.status(200).send("Ok");
});

router.get('/profile', authorize, userController.profile);
router.get('/logout', authorize, userController.logout);

router.get('/:id', userController.show);

router.post('/authenticate', userController.authenticate); 
router.post('/new', userController.create);




module.exports = router;
