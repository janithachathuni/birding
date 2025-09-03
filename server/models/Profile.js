const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  displayName: { type: String, required: true },
    profilePic: { type: String },
    bannerPic: { type: String },
    bio: { type: String, maxlength: 500 },
});
