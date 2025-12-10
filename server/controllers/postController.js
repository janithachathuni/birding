const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Reply = require('../models/Reply');
const Profile = require('../models/Profile');
const Bird = require('../models/Bird'); // Assuming you have a Bird model

// Create a new post
exports.createPost = async (req, res) => {
  try {
    console.log("=== CREATE POST CONTROLLER ===");
    console.log("Request body:", req.body);
    
    const { caption, location, hashtags, images, userId } = req.body;

    // Get userId from body
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Validate each image has at least one bird tag
    for (const image of images) {
      if (!image.birds || image.birds.length === 0) {
        return res.status(400).json({ error: 'Each image must have at least one bird tag' });
      }
    }

    const post = new Post({
      user: userId,
      caption,
      location,
      hashtags: hashtags || [],
      images
    });

    await post.save();
    
    // Populate user details for response
    await post.populate({
      path: 'user',
      select: 'username profilePic'
    });

    // Populate bird details for verified birds
    await post.populate({
      path: 'images.birds.birdId',
      select: 'primaryName scientificName image otherNames sinhalaName tamilName'
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all posts (with pagination)
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // All posts are public now (no privacy settings)
    const query = {
      hiddenFrom: { $ne: req.user?.id || null }
    };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profilePic')
      .populate({
        path: 'images.birds.birdId',
        select: 'primaryName scientificName image'
      })
      .populate('allBirdsInPost', 'primaryName scientificName');

    const totalPosts = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit)
      }
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username profilePic')
      .populate({
        path: 'images.birds.birdId',
        select: 'primaryName otherNames sinhalaName tamilName scientificName image'
      })
      .populate('allBirdsInPost', 'primaryName scientificName');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user has hidden this post
    const userId = req.user?.id;
    if (userId && post.hiddenFrom.includes(userId)) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get posts by user
exports.getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const viewerId = req.user?.id;
    
    const query = { 
      user: userId,
      hiddenFrom: { $ne: viewerId || null }
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profilePic')
      .populate({
        path: 'images.birds.birdId',
        select: 'primaryName scientificName image'
      });

    const totalPosts = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit)
      }
    });
  } catch (error) {
    console.error('Error getting user posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get posts by bird ID
exports.getPostsByBird = async (req, res) => {
  try {
    const birdId = req.params.birdId;
    
    const query = {
      'images.birds.birdId': birdId,
      hiddenFrom: { $ne: req.user?.id || null }
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profilePic')
      .populate({
        path: 'images.birds.birdId',
        select: 'primaryName scientificName image'
      })
      .populate('allBirdsInPost', 'primaryName scientificName');

    const totalPosts = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit)
      }
    });
  } catch (error) {
    console.error('Error getting posts by bird:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { caption, location, hashtags } = req.body;
    const userId = req.user.id;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user owns the post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }
    
    // Update fields
    post.caption = caption || post.caption;
    post.location = location || post.location;
    post.hashtags = hashtags || post.hashtags;
    
    await post.save();
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user owns the post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    // Delete all comments associated with this post
    await Comment.deleteMany({ _id: { $in: post.comments } });
    
    // Delete the post
    await post.deleteOne();
    
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Like/Unlike post
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // Like the post
      post.likes.push(userId);
    } else {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    }
    
    await post.save();
    
    res.json({
      success: true,
      data: {
        liked: likeIndex === -1,
        likeCount: post.likes.length
      }
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// delete posts, activate this AFTER i have done the comments parts too.
// Delete post
// exports.deletePost = async (req, res) => {
//   try {
//     const { userId } = req.body;  // Get userId from body instead of req.user
    
//     if (!userId) {
//       return res.status(400).json({ error: 'User ID is required' });
//     }
    
//     const post = await Post.findById(req.params.id);
    
//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }
    
//     // Check if user owns the post
//     if (post.user.toString() !== userId) {
//       return res.status(403).json({ error: 'Not authorized to delete this post' });
//     }
    
//     // Delete all comments associated with this post
//     await Comment.deleteMany({ _id: { $in: post.comments } });
    
//     // Delete the post
//     await post.deleteOne();
    
//     res.json({
//       success: true,
//       message: 'Post deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// Hide post from user
exports.hidePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Add user to hiddenFrom array if not already there
    if (!post.hiddenFrom.includes(userId)) {
      post.hiddenFrom.push(userId);
      await post.save();
    }
    
    res.json({
      success: true,
      message: 'Post hidden successfully'
    });
  } catch (error) {
    console.error('Error hiding post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search posts by hashtag, caption, or bird name
exports.searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // First, search for birds matching the query
    const matchingBirds = await Bird.find({
      $or: [
        { primaryName: { $regex: q, $options: 'i' } },
        { scientificName: { $regex: q, $options: 'i' } },
        { otherNames: { $regex: q, $options: 'i' } },
        { sinhalaName: { $regex: q, $options: 'i' } },
        { tamilName: { $regex: q, $options: 'i' } }
      ]
    }).select('_id');

    const birdIds = matchingBirds.map(bird => bird._id);
    
    const query = {
      $or: [
        { caption: { $regex: q, $options: 'i' } },
        { hashtags: { $regex: q, $options: 'i' } },
        { 'images.birds.taggedName': { $regex: q, $options: 'i' } },
        { 'images.birds.birdId': { $in: birdIds } }
      ],
      hiddenFrom: { $ne: req.user?.id || null }
    };
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profilePic')
      .populate({
        path: 'images.birds.birdId',
        select: 'primaryName scientificName image'
      });
    
    const totalPosts = await Post.countDocuments(query);
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit)
      }
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};