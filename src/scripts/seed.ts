import { connectDB, disconnectDB } from '../config/database';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';
import { Follow } from '../models/Follow';

const seedUsers = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    displayName: 'John Doe',
    bio: 'Software developer and coffee enthusiast ☕',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'sarahsmith',
    email: 'sarah@example.com',
    displayName: 'Sarah Smith',
    bio: 'Designer by day, photographer by night 📸',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e2?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'mikejohnson',
    email: 'mike@example.com',
    displayName: 'Mike Johnson',
    bio: 'Tech blogger and startup founder 🚀',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'emilydavis',
    email: 'emily@example.com',
    displayName: 'Emily Davis',
    bio: 'Product manager and hiking enthusiast 🥾',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'alexwilson',
    email: 'alex@example.com',
    displayName: 'Alex Wilson',
    bio: null,
    avatar: null
  }
];

const seedPosts = [
  {
    title: 'Getting Started with GraphQL',
    content: 'Just built my first GraphQL API and I\'m amazed by how clean and efficient it is! The type system makes development so much smoother. Anyone else working with GraphQL lately?',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop'
  },
  {
    title: 'Beautiful Sunset from My Hike',
    content: 'Caught this incredible sunset during my weekend hike. Sometimes you need to disconnect from screens and connect with nature. What\'s your favorite way to unwind?',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
  },
  {
    title: 'Coffee Shop Discoveries',
    content: 'Found this amazing local coffee shop with the perfect atmosphere for coding. Their Ethiopian beans are incredible! ☕ What\'s your go-to work spot?',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop'
  },
  {
    title: 'New Product Launch Insights',
    content: 'Just wrapped up our biggest product launch yet! Key learning: user feedback during beta testing is absolutely invaluable. The iterations we made based on early user input made all the difference.',
    imageUrl: null
  },
  {
    title: 'Docker vs Podman: My Experience',
    content: 'Been experimenting with Podman as a Docker alternative. The rootless containers and systemd integration are impressive, but Docker\'s ecosystem is still unmatched. Thoughts?',
    imageUrl: null
  },
  {
    title: 'Weekend Photography Session',
    content: 'Spent the day capturing street photography downtown. There\'s something magical about candid moments in urban settings. Photography teaches you to really see the world differently.',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop'
  },
  {
    title: 'Startup Life: Lessons Learned',
    content: 'Two years into building our startup and here are the biggest lessons: 1) Talk to customers early and often, 2) Build MVP fast, 3) Team culture matters more than you think. What would you add?',
    imageUrl: null
  },
  {
    title: 'Mountain Trail Adventure',
    content: 'Conquered the 10-mile mountain trail today! The views at the summit were absolutely worth every step. Already planning the next adventure. Any recommendations for challenging trails?',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
  }
];

const seedComments = [
  { content: 'Great insights! I\'ve been wanting to try GraphQL for my next project.', postIndex: 0 },
  { content: 'The type safety alone makes it worth switching from REST.', postIndex: 0 },
  { content: 'Absolutely stunning! Where was this taken?', postIndex: 1 },
  { content: 'Nature photography at its finest 📸', postIndex: 1 },
  { content: 'I need to find spots like this for remote work!', postIndex: 2 },
  { content: 'Ethiopian coffee is the best! What brewing method do you use?', postIndex: 2 },
  { content: 'Congrats on the launch! User feedback is definitely crucial.', postIndex: 3 },
  { content: 'Would love to hear more details about your beta testing process.', postIndex: 3 },
  { content: 'Been curious about Podman too. How\'s the learning curve?', postIndex: 4 },
  { content: 'Docker\'s ecosystem is hard to beat, but competition is good!', postIndex: 4 },
  { content: 'Love the urban photography style! What camera do you use?', postIndex: 5 },
  { content: 'Street photography captures life in such an authentic way.', postIndex: 5 },
  { content: 'Great advice! I\'d add: don\'t be afraid to pivot when needed.', postIndex: 6 },
  { content: 'Team culture really is everything. Thanks for sharing!', postIndex: 6 },
  { content: 'That\'s an impressive distance! I\'m inspired to start hiking.', postIndex: 7 },
  { content: 'The summit views always make the climb worth it!', postIndex: 7 }
];

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    Follow.deleteMany({}),
    Like.deleteMany({}),
    Comment.deleteMany({}),
    Post.deleteMany({}),
    User.deleteMany({})
  ]);
}

async function createUsers() {
  console.log('👥 Creating users...');
  const users = await User.insertMany(seedUsers);
  console.log(`Created ${users.length} users`);
  return users;
}

async function createPosts(users: any[]) {
  console.log('📝 Creating posts...');
  const postsWithAuthors = seedPosts.map((post, index) => ({
    ...post,
    authorId: users[index % users.length]._id
  }));

  const posts = await Post.insertMany(postsWithAuthors);
  console.log(`Created ${posts.length} posts`);
  return posts;
}

async function createComments(users: any[], posts: any[]) {
  console.log('💬 Creating comments...');
  const commentsWithRefs = seedComments.map((comment, index) => ({
    content: comment.content,
    authorId: users[(index + 1) % users.length]._id, // Different author than post
    postId: posts[comment.postIndex]._id
  }));

  const comments = await Comment.insertMany(commentsWithRefs);
  console.log(`Created ${comments.length} comments`);
  return comments;
}

async function createLikes(users: any[], posts: any[]) {
  console.log('❤️  Creating likes...');
  const likes = [];

  // Create varied likes across posts and users
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const numLikes = Math.floor(Math.random() * 4) + 1; // 1-4 likes per post

    for (let j = 0; j < numLikes; j++) {
      const userIndex = (i + j) % users.length;
      likes.push({
        userId: users[userIndex]._id,
        postId: post._id
      });
    }
  }

  // Remove duplicates and insert
  const uniqueLikes = likes.filter((like, index, self) =>
    index === self.findIndex(l =>
      l.userId.toString() === like.userId.toString() &&
      l.postId.toString() === like.postId.toString()
    )
  );

  const createdLikes = await Like.insertMany(uniqueLikes);
  console.log(`Created ${createdLikes.length} likes`);
  return createdLikes;
}

async function createFollows(users: any[]) {
  console.log('👥 Creating follow relationships...');
  const follows = [];

  // For resume project: Make first user (john) have connections with all other users
  const johnUser = users[0]; // johndoe

  // John follows everyone else
  for (let i = 1; i < users.length; i++) {
    follows.push({
      followerId: johnUser._id,
      followingId: users[i]._id
    });
  }

  // Everyone else follows John back (creating mutual friendships)
  for (let i = 1; i < users.length; i++) {
    follows.push({
      followerId: users[i]._id,
      followingId: johnUser._id
    });
  }

  // Create some additional cross-connections between other users
  // Sarah follows Mike and Emily
  if (users.length >= 4) {
    follows.push(
      { followerId: users[1]._id, followingId: users[2]._id }, // Sarah -> Mike
      { followerId: users[1]._id, followingId: users[3]._id }, // Sarah -> Emily
      { followerId: users[2]._id, followingId: users[1]._id }, // Mike -> Sarah
      { followerId: users[3]._id, followingId: users[2]._id }  // Emily -> Mike
    );
  }

  const createdFollows = await Follow.insertMany(follows);

  // Update user documents with following/followers arrays
  for (const follow of createdFollows) {
    await Promise.all([
      User.findByIdAndUpdate(follow.followerId, {
        $addToSet: { following: follow.followingId }
      }),
      User.findByIdAndUpdate(follow.followingId, {
        $addToSet: { followers: follow.followerId }
      })
    ]);
  }

  console.log(`Created ${createdFollows.length} follow relationships`);
  return createdFollows;
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDB();
    await clearDatabase();

    const users = await createUsers();
    const posts = await createPosts(users);
    const comments = await createComments(users, posts);
    const likes = await createLikes(users, posts);
    const follows = await createFollows(users);

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Posts: ${posts.length}`);
    console.log(`   Comments: ${comments.length}`);
    console.log(`   Likes: ${likes.length}`);
    console.log(`   Follows: ${follows.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };