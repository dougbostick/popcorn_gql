import mongoose, { Schema, Document } from 'mongoose';

export interface FollowInterface extends Document {
  followerId: mongoose.Types.ObjectId; // User who follows
  followingId: mongoose.Types.ObjectId; // User being followed
  createdAt: Date;
}

const FollowSchema: Schema = new Schema({
  followerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followingId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Compound index to prevent duplicate follows and improve query performance
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Individual indexes for common queries
FollowSchema.index({ followerId: 1 }); // Get all users this user follows
FollowSchema.index({ followingId: 1 }); // Get all followers of this user

export const Follow = mongoose.model<FollowInterface>('Follow', FollowSchema);