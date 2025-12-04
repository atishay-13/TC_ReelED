const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        username: true,
        name: true
      }
    })
    
    console.log('Users in database:')
    console.log(users)
    
    if (users.length === 0) {
      console.log('\n❌ No users found! Run: npm run db:seed')
    } else {
      console.log('\n✅ Database has users!')
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()
