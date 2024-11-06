// prisma/seed.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.users.create({
    data: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@markival.com',
      status: 'active',
      country: 'USA',
      state: 'California',
      city: 'San Francisco',
      street: '1234 Market St',
      avatar: 'https://example.com/avatar.jpg'
    }
  })

  console.log('User created')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
