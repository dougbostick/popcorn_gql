import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  postId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  }
}, {
  timestamps: { updatedAt: false } // Only track createdAt for likes
});

// Compound unique index - prevent duplicate likes
LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

// Indexes for performance
LikeSchema.index({ postId: 1 });
LikeSchema.index({ userId: 1 });

export const Like = mongoose.model<ILike>('Like', LikeSchema);