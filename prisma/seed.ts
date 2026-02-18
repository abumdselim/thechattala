import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  console.log('Creating categories...')
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        nameBn: 'ইলেকট্রনিক্স',
        slug: 'electronics',
        description: 'Mobile phones, computers, and electronic devices',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        nameBn: 'ফ্যাশন',
        slug: 'fashion',
        description: 'Clothing, shoes, and accessories',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-living' },
      update: {},
      create: {
        name: 'Home & Living',
        nameBn: 'ঘর ও জীবনযাত্রা',
        slug: 'home-living',
        description: 'Furniture, home decor, and appliances',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'vehicles' },
      update: {},
      create: {
        name: 'Vehicles',
        nameBn: 'যানবাহন',
        slug: 'vehicles',
        description: 'Cars, motorcycles, and bicycles',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'books-hobbies' },
      update: {},
      create: {
        name: 'Books & Hobbies',
        nameBn: 'বই ও শখ',
        slug: 'books-hobbies',
        description: 'Books, games, and hobby items',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'services' },
      update: {},
      create: {
        name: 'Services',
        nameBn: 'সেবা',
        slug: 'services',
        description: 'Professional and personal services',
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Create a test admin user (you'll need to update with real email)
  console.log('Creating test admin user...')
  
  const adminEmail = 'admin@thechattala.com'
  
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      role: 'ADMIN',
      verified: true,
      suspended: false,
    },
  })

  console.log(`✅ Created admin user: ${adminUser.email}`)

  // Create test regular users
  console.log('Creating test users...')
  
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        email: 'user1@example.com',
        name: 'Karim Ahmed',
        role: 'USER',
        verified: true,
        suspended: false,
      },
    }),
    prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        email: 'user2@example.com',
        name: 'Fatima Rahman',
        role: 'USER',
        verified: false,
        suspended: false,
      },
    }),
  ])

  console.log(`✅ Created ${users.length} test users`)

  // Create sample products
  console.log('Creating sample products...')
  
  const electronicsCategory = categories.find(c => c.slug === 'electronics')!
  const fashionCategory = categories.find(c => c.slug === 'fashion')!
  
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'iPhone 13 Pro',
        titleBn: 'আইফোন ১৩ প্রো',
        description: 'Like new condition iPhone 13 Pro with 256GB storage. Original box and accessories included.',
        price: 85000,
        images: ['https://via.placeholder.com/400x300?text=iPhone+13+Pro'],
        categoryId: electronicsCategory.id,
        location: 'Agrabad, Chattogram',
        contact: '+8801712345678',
        status: 'APPROVED',
        sellerId: users[0].id,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Samsung Galaxy S21',
        titleBn: 'স্যামসাং গ্যালাক্সি S21',
        description: 'Excellent condition Galaxy S21 with warranty. 128GB storage, all accessories.',
        price: 45000,
        images: ['https://via.placeholder.com/400x300?text=Galaxy+S21'],
        categoryId: electronicsCategory.id,
        location: 'Halishahar, Chattogram',
        contact: '+8801812345678',
        status: 'PENDING',
        sellerId: users[1].id,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Designer Kurti Set',
        titleBn: 'ডিজাইনার কুর্তি সেট',
        description: 'Beautiful embroidered kurti set, size M. Worn only once for occasion.',
        price: 2500,
        images: ['https://via.placeholder.com/400x300?text=Designer+Kurti'],
        categoryId: fashionCategory.id,
        location: 'GEC Circle, Chattogram',
        contact: '+8801912345678',
        status: 'APPROVED',
        sellerId: users[0].id,
      },
    }),
  ])

  console.log(`✅ Created ${products.length} sample products`)

  // Create sample posts
  console.log('Creating sample posts...')
  
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Welcome to TheChattala Community!',
        titleBn: 'চট্টলা কমিউনিটিতে স্বাগতম!',
        content: 'This is a community platform for Chittagong residents to buy, sell, and connect with each other. Feel free to share your thoughts and experiences!',
        pinned: true,
        authorId: adminUser.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Best places for biryani in Chattogram?',
        titleBn: 'চট্টগ্রামে বিরিয়ানির সেরা জায়গা?',
        content: 'Looking for recommendations for authentic biryani places in Chattogram. What are your favorites?',
        pinned: false,
        authorId: users[0].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Local pickup meetup spots',
        titleBn: 'লোকাল পিকআপ মিটআপ স্পট',
        content: 'Let\'s share safe public places for local pickup meetups when buying/selling items. I usually use GEC Circle or Agrabad.',
        pinned: false,
        authorId: users[1].id,
      },
    }),
  ])

  console.log(`✅ Created ${posts.length} sample posts`)

  // Create sample comments
  console.log('Creating sample comments...')
  
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great idea! I also recommend meeting at busy public places during daytime.',
        postId: posts[2].id,
        authorId: users[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Try Handi Restaurant near GEC or Koyla for authentic taste!',
        postId: posts[1].id,
        authorId: users[1].id,
      },
    }),
  ])

  console.log(`✅ Created ${comments.length} sample comments`)

  console.log('✨ Database seeding completed successfully!')
  console.log('\n📝 Note: To create your admin account:')
  console.log(`   1. Sign up on the platform`)
  console.log(`   2. Run: npx prisma studio`)
  console.log(`   3. Find your user and change role to 'ADMIN'`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
