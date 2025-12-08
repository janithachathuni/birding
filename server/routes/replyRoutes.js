const express = require('express');
const router = express.Router();
const {
    addReply,
    getCommentReplies,
    updateReply,
    deleteReply,
    toggleReplyLike
} = require('../controllers/replyController');

// Add reply to comment
router.post('/:commentId/replies', addReply);

// Get replies for a comment
router.get('/:commentId/replies', getCommentReplies);

// Update reply
router.put('/:replyId', updateReply);

// Delete reply
router.delete('/:replyId', deleteReply);

// Like/Unlike reply
router.post('/:replyId/like', toggleReplyLike);

module.exports = router;