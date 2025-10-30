import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  content: string;
  authorId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  content: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  authorId: { 
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
  timestamps: true
});

// Indexes for performance
CommentSchema.index({ postId: 1 });
CommentSchema.index({ authorId: 1 });
CommentSchema.index({ createdAt: -1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);