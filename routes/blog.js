const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');

router.get('/', blogController.blogList);

router.post('/', blogController.addBlog);

router.put('/:blogId/update', blogController.updateBlog);

router.delete('/:blogId/delete', blogController.deleteBlog);

router.get('/:blogId', blogController.getBlog);

module.exports = router;
