const express = require('express');
const router = express.Router();
const {
    addComment,
    getPostComments,
    updateComment,
    deleteComment,
    toggleCommentLike
} = require('../controllers/commentController');

// Add comment to post
router.post('/:postId/comments', addComment);

// Get comments for a post
router.get('/:postId/comments', getPostComments);

// Update comment
router.put('/:commentId', updateComment);

// Delete comment
router.delete('/:commentId', deleteComment);

// Like/Unlike comment
router.post('/:commentId/like', toggleCommentLike);

module.exports = router;