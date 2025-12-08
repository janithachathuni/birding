const mongoose = require('mongoose');

const PostImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  birds: [{
    birdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bird',
      required: true
    },
    // The name used for tagging (could be primaryName, otherNames, sinhalaName, or tamilName)
    taggedName: {
      type: String,
      required: true
    },
    // Optional: Store which type of name was used (for analytics/display)
    nameType: {
      type: String,
      enum: ['primaryName', 'otherName', 'sinhalaName', 'tamilName'],
      default: 'primaryName'
    }
  }],
  // Coordinates for bird sighting location (optional)
  location: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    placeName: String
  }
});

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [PostImageSchema],
  // Main image for thumbnail/preview
  mainImage: {
    type: String
  },
  // Post-level caption (not per image)
  caption: {
    type: String,
    maxlength: 2200
  },
  // Optional location for the entire post
  location: {
    type: String
  },
  hashtags: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  // All unique birds in this post (for easy filtering/searching)
  allBirdsInPost: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bird'
  }],
  // Privacy settings
  privacy: {
    type: String,
    enum: ['public', 'private', 'followers'],
    default: 'public'
  },
  // Users who have hidden/blocked this post
  hiddenFrom: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ 'images.birds.birdId': 1 });
PostSchema.index({ allBirdsInPost: 1 });
PostSchema.index({ hashtags: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ privacy: 1 });

// Middleware to handle automatic updates
PostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set mainImage to first image if not set
  if (this.images.length > 0 && !this.mainImage) {
    this.mainImage = this.images[0].imageUrl;
  }
  
  // Update allBirdsInPost array with unique bird IDs
  if (this.isModified('images')) {
    const birdIds = new Set();
    this.images.forEach(image => {
      image.birds.forEach(bird => {
        birdIds.add(bird.birdId.toString());
      });
    });
    this.allBirdsInPost = Array.from(birdIds);
  }
  
  next();
});

// Virtual for like count
PostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
PostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Method to check if user has liked the post
PostSchema.methods.hasLiked = function(userId) {
  return this.likes.some(like => like.toString() === userId.toString());
};

module.exports = mongoose.model('Post', PostSchema);