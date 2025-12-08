const Reply = require('../models/Reply');
const Comment = require('../models/Comment');

// Add reply to comment
exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const commentId = req.params.commentId;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Reply content is required' });
    }
    
    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Create new reply
    const reply = new Reply({
      user: userId,
      content: content.trim(),
      likes: []
    });
    
    await reply.save();
    
    // Add reply to comment
    comment.replies.push(reply._id);
    await comment.save();
    
    // Populate user details
    await reply.populate('user', 'username profilePic');
    
    res.status(201).json({
      success: true,
      data: reply
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get replies for a comment (with pagination)
exports.getCommentReplies = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Get reply IDs from comment
    const replyIds = comment.replies;
    
    const replies = await Reply.find({ _id: { $in: replyIds } })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profilePic');
    
    const totalReplies = replyIds.length;
    
    res.json({
      success: true,
      data: replies,
      pagination: {
        page,
        limit,
        total: totalReplies,
        pages: Math.ceil(totalReplies / limit)
      }
    });
  } catch (error) {
    console.error('Error getting replies:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update reply
exports.updateReply = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const replyId = req.params.replyId;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Reply content is required' });
    }
    
    const reply = await Reply.findById(replyId);
    
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }
    
    // Check if user owns the reply
    if (reply.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this reply' });
    }
    
    reply.content = content.trim();
    await reply.save();
    
    res.json({
      success: true,
      data: reply
    });
  } catch (error) {
    console.error('Error updating reply:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete reply
exports.deleteReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const replyId = req.params.replyId;
    
    const reply = await Reply.findById(replyId);
    
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }
    
    // Check if user owns the reply OR is the comment owner
    const comment = await Comment.findOne({ replies: replyId });
    const isCommentOwner = comment && comment.user.toString() === userId;
    
    if (reply.user.toString() !== userId && !isCommentOwner) {
      return res.status(403).json({ error: 'Not authorized to delete this reply' });
    }
    
    // Remove reply from comment
    if (comment) {
      comment.replies.pull(replyId);
      await comment.save();
    }
    
    // Delete the reply
    await reply.deleteOne();
    
    res.json({
      success: true,
      message: 'Reply deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Like/Unlike reply
exports.toggleReplyLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const replyId = req.params.replyId;
    
    const reply = await Reply.findById(replyId);
    
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }
    
    const likeIndex = reply.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // Like the reply
      reply.likes.push(userId);
    } else {
      // Unlike the reply
      reply.likes.splice(likeIndex, 1);
    }
    
    await reply.save();
    
    res.json({
      success: true,
      data: {
        liked: likeIndex === -1,
        likeCount: reply.likes.length
      }
    });
  } catch (error) {
    console.error('Error toggling reply like:', error);
    res.status(500).json({ error: 'Server error' });
  }
};