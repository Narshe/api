let express = require('express');
let router = express.Router();
let PostController = require('../controllers/PostController');
var authorize = require('../middlewares/authorize');

const postController = new PostController();


router.get('/',  postController.index);
router.get('/:id', postController.show);
router.post('/', authorize,  postController.create);
router.delete('/:id', authorize, postController.destroy);

module.exports = router;