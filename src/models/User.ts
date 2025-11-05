import mongoose, { Schema, Document } from 'mongoose';

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio?: string | null;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Following relationships
  following: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  displayName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  bio: { 
    type: String, 
    default: null,
    maxlength: 160
  },
  avatar: {
    type: String,
    default: null
  },
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for performance
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

export const User = mongoose.model<UserInterface>('User', UserSchema);