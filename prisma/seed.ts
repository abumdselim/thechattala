import { PrismaClient, CategoryType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create Categories
  console.log('Creating categories...')
  
  const marketplaceCategories = [
    { name: 'Electronics', slug: 'electronics', type: CategoryType.MARKETPLACE },
    { name: 'Fashion & Apparel', slug: 'fashion-apparel', type: CategoryType.MARKETPLACE },
    { name: 'Home & Garden', slug: 'home-garden', type: CategoryType.MARKETPLACE },
    { name: 'Vehicles', slug: 'vehicles', type: CategoryType.MARKETPLACE },
    { name: 'Services', slug: 'services', type: CategoryType.MARKETPLACE },
    { name: 'Books & Education', slug: 'books-education', type: CategoryType.MARKETPLACE },
  ]

  const communityCategories = [
    { name: 'Local News', slug: 'local-news', type: CategoryType.COMMUNITY },
    { name: 'Events', slug: 'events', type: CategoryType.COMMUNITY },
    { name: 'Discussions', slug: 'discussions', type: CategoryType.COMMUNITY },
    { name: 'Announcements', slug: 'announcements', type: CategoryType.COMMUNITY },
  ]

  for (const category of [...marketplaceCategories, ...communityCategories]) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  // Create Sample Users
  console.log('Creating users...')
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@thechattala.com' },
    update: {},
    create: {
      email: 'admin@thechattala.com',
      name: 'Admin User',
      role: 'ADMIN',
      bio: 'Platform administrator for The Chattala',
      location: 'GEC Circle',
      phoneNumber: '+880 1234-567890',
    },
  })

  const user1 = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      name: 'Karim Rahman',
      bio: 'Tech enthusiast and seller',
      location: 'Agrabad',
      phoneNumber: '+880 1711-123456',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      name: 'Fatima Ahmed',
      bio: 'Looking for great deals in Chattogram',
      location: 'Khulshi',
      phoneNumber: '+880 1811-234567',
    },
  })

  // Create Sample Products
  console.log('Creating products...')
  
  const electronicsCategory = await prisma.category.findFirst({
    where: { slug: 'electronics' },
  })

  if (electronicsCategory) {
    await prisma.product.create({
      data: {
        title: 'iPhone 13 Pro - Excellent Condition',
        description: 'Lightly used iPhone 13 Pro in excellent condition. No scratches, battery health 95%. Comes with original box and charger.',
        price: 75000,
        condition: 'like-new',
        images: ['/placeholder-phone.jpg'],
        sellerId: user1.id,
        categoryId: electronicsCategory.id,
      },
    })

    await prisma.product.create({
      data: {
        title: 'Dell Laptop - Core i5, 8GB RAM',
        description: 'Dell Inspiron laptop in good working condition. Perfect for students and professionals.',
        price: 35000,
        condition: 'good',
        images: ['/placeholder-laptop.jpg'],
        sellerId: user1.id,
        categoryId: electronicsCategory.id,
      },
    })
  }

  // Create Sample Posts
  console.log('Creating posts...')
  
  const newsCategory = await prisma.category.findFirst({
    where: { slug: 'local-news' },
  })

  if (newsCategory) {
    await prisma.post.create({
      data: {
        title: 'New Metro Rail Extension Plans Announced',
        content: 'The government has announced plans to extend the Chattogram metro rail network to Halishahar and Agrabad areas. Construction is expected to begin next year.',
        images: [],
        isVerified: true,
        authorId: adminUser.id,
        categoryId: newsCategory.id,
      },
    })
  }

  const eventsCategory = await prisma.category.findFirst({
    where: { slug: 'events' },
  })

  if (eventsCategory) {
    await prisma.post.create({
      data: {
        title: 'Book Fair at GEC Circle - This Weekend',
        content: 'Join us for the annual book fair at GEC Circle this weekend. Great collection of books from local and international publishers.',
        images: [],
        authorId: user2.id,
        categoryId: eventsCategory.id,
      },
    })
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
