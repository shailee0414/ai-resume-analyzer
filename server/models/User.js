import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.toPublic = function () {
  return { id: this._id.toString(), email: this.email, createdAt: this.createdAt };
};

export default mongoose.model('User', userSchema);
