import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  imageUrl?: string | null;
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  content: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  imageUrl: { 
    type: String, 
    default: null
  },
  authorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true
});

// Indexes for performance
PostSchema.index({ authorId: 1 });
PostSchema.index({ createdAt: -1 }); // For chronological feeds

export const Post = mongoose.model<IPost>('Post', PostSchema);