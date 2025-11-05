import { User } from '../models/User';
import { Follow } from '../models/Follow';

/**
 * Automatically create 8 mutual friendships for a new user
 * This is for the resume project to ensure populated feeds
 */
export async function createAutoFriendships(newUserId: string): Promise<void> {
  try {
    // Get up to 8 existing users (excluding the new user)
    const existingUsers = await User.find({ _id: { $ne: newUserId } })
      .limit(8)
      .select('_id')
      .lean();

    if (existingUsers.length === 0) {
      console.log('No existing users to befriend');
      return;
    }

    const followRelationships = [];

    // Create mutual follow relationships
    for (const existingUser of existingUsers) {
      // New user follows existing user
      followRelationships.push({
        followerId: newUserId,
        followingId: existingUser._id
      });

      // Existing user follows new user back
      followRelationships.push({
        followerId: existingUser._id,
        followingId: newUserId
      });
    }

    // Insert all follow relationships
    await Follow.insertMany(followRelationships);

    // Update the new user's following array
    const followingIds = existingUsers.map(user => user._id);
    await User.findByIdAndUpdate(newUserId, {
      $addToSet: { following: { $each: followingIds } }
    });

    // Update the new user's followers array
    await User.findByIdAndUpdate(newUserId, {
      $addToSet: { followers: { $each: followingIds } }
    });

    // Update each existing user's arrays
    for (const existingUser of existingUsers) {
      await Promise.all([
        User.findByIdAndUpdate(existingUser._id, {
          $addToSet: { following: newUserId }
        }),
        User.findByIdAndUpdate(existingUser._id, {
          $addToSet: { followers: newUserId }
        })
      ]);
    }

    console.log(`Created ${followRelationships.length} follow relationships for new user`);
  } catch (error) {
    console.error('Error creating auto-friendships:', error);
    // Don't throw - user creation should still succeed even if auto-friending fails
  }
}