const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RegisterSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'birder'], default: 'birder' } // Example roles
});

// Pre-save hook to hash password before saving
RegisterSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password during login
RegisterSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the model
const RegisterModel = mongoose.model('Register', RegisterSchema);
module.exports = RegisterModel;
