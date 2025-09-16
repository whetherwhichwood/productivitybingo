import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample account
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const account = await prisma.account.upsert({
    where: { email: 'demo@productivitybingo.com' },
    update: {},
    create: {
      email: 'demo@productivitybingo.com',
      password: hashedPassword,
      name: 'The Smith Family',
      users: {
        create: [
          {
            name: 'Sir Knight',
            email: 'knight@castle.com'
          },
          {
            name: 'Lady Warrior',
            email: 'warrior@castle.com'
          }
        ]
      }
    },
    include: {
      users: true
    }
  })

  console.log('✅ Account created:', account.email)

  // Create sample bingo board for the first user
  const user = account.users[0]
  const currentDate = new Date()
  
  const bingoBoard = await prisma.bingoBoard.create({
    data: {
      userId: user.id,
      size: 3,
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      isActive: true,
      squares: {
        create: [
          { position: 0, content: 'Fix the broken cabinet door', type: 'TOLERATION', isCompleted: false },
          { position: 1, content: 'Call the dentist', type: 'TASK', isCompleted: true, completedAt: new Date() },
          { position: 2, content: 'Organize the garage', type: 'TOLERATION', isCompleted: false },
          { position: 3, content: 'Buy new laundry bin', type: 'TOLERATION', isCompleted: false },
          { position: 4, content: 'FREE SPACE', type: 'FREE_SPACE', isCompleted: true },
          { position: 5, content: 'Schedule car maintenance', type: 'TASK', isCompleted: false },
          { position: 6, content: 'Clean out email inbox', type: 'TASK', isCompleted: true, completedAt: new Date() },
          { position: 7, content: 'Update resume', type: 'TASK', isCompleted: false },
          { position: 8, content: 'Fix squeaky door', type: 'TOLERATION', isCompleted: false }
        ]
      }
    },
    include: {
      squares: true
    }
  })

  console.log('✅ Bingo board created with', bingoBoard.squares.length, 'squares')

  // Create sample rewards
  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        userId: user.id,
        name: 'Order my favorite takeout',
        description: 'Get that delicious meal you\'ve been craving',
        points: 3
      }
    }),
    prisma.reward.create({
      data: {
        userId: user.id,
        name: 'Buy a new book',
        description: 'Add something exciting to your reading list',
        points: 5
      }
    }),
    prisma.reward.create({
      data: {
        userId: user.id,
        name: 'Take a relaxing bath',
        description: 'Unwind with some self-care time',
        points: 1
      }
    }),
    prisma.reward.create({
      data: {
        userId: user.id,
        name: 'Go to a movie',
        description: 'Enjoy a night out at the cinema',
        points: 10
      }
    })
  ])

  console.log('✅ Created', rewards.length, 'sample rewards')

  // Create sample tolerations
  const tolerations = await Promise.all([
    prisma.toleration.create({
      data: {
        userId: user.id,
        description: 'Fix the broken cabinet door'
      }
    }),
    prisma.toleration.create({
      data: {
        userId: user.id,
        description: 'Organize the garage'
      }
    }),
    prisma.toleration.create({
      data: {
        userId: user.id,
        description: 'Buy new laundry bin'
      }
    }),
    prisma.toleration.create({
      data: {
        userId: user.id,
        description: 'Fix squeaky door'
      }
    })
  ])

  console.log('✅ Created', tolerations.length, 'sample tolerations')

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        userId: user.id,
        description: 'Call the dentist'
      }
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        description: 'Schedule car maintenance'
      }
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        description: 'Clean out email inbox'
      }
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        description: 'Update resume'
      }
    })
  ])

  console.log('✅ Created', tasks.length, 'sample tasks')

  console.log('🎉 Database seeded successfully!')
  console.log('📧 Demo account: demo@productivitybingo.com')
  console.log('🔑 Demo password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
