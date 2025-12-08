const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Reply = require('../models/Reply');

// Add comment to post
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const postId = req.params.postId;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Comment content is required' });
    }
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user can view this post
    if (post.privacy !== 'public' && post.user.toString() !== userId) {
      // Add follower check if needed
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Create new comment
    const comment = new Comment({
      user: userId,
      content: content.trim(),
      likes: [],
      replies: []
    });
    
    await comment.save();
    
    // Add comment to post
    post.comments.push(comment._id);
    await post.save();
    
    // Populate user details
    await comment.populate('user', 'username profilePic');
    
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get comments for a post (with pagination)
exports.getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Get comment IDs from post
    const commentIds = post.comments;
    
    const comments = await Comment.find({ _id: { $in: commentIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profilePic')
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: 'username profilePic'
        },
        options: { sort: { createdAt: 1 }, limit: 5 }
      });
    
    const totalComments = commentIds.length;
    
    res.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total: totalComments,
        pages: Math.ceil(totalComments / limit)
      }
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const commentId = req.params.commentId;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Comment content is required' });
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Check if user owns the comment
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this comment' });
    }
    
    comment.content = content.trim();
    await comment.save();
    
    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.commentId;
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Check if user owns the comment OR is the post owner
    const post = await Post.findOne({ comments: commentId });
    const isPostOwner = post && post.user.toString() === userId;
    
    if (comment.user.toString() !== userId && !isPostOwner) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    // Delete all replies associated with this comment
    await Reply.deleteMany({ _id: { $in: comment.replies } });
    
    // Remove comment from post
    if (post) {
      post.comments.pull(commentId);
      await post.save();
    }
    
    // Delete the comment
    await comment.deleteOne();
    
    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Like/Unlike comment
exports.toggleCommentLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.commentId;
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    const likeIndex = comment.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // Like the comment
      comment.likes.push(userId);
    } else {
      // Unlike the comment
      comment.likes.splice(likeIndex, 1);
    }
    
    await comment.save();
    
    res.json({
      success: true,
      data: {
        liked: likeIndex === -1,
        likeCount: comment.likes.length
      }
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({ error: 'Server error' });
  }
};