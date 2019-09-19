let express = require('express');
let router = express.Router();
let CommentController = require('../controllers/CommentController');
var authorize = require('../middlewares/authorize');

const commentController = new CommentController();

router.get('/:id/:limit', commentController.index);
router.post('/', authorize,  commentController.create);
router.delete('/:id', authorize, commentController.destroy);

module.exports = router;