import { PrismaClient } from '@prisma/client'

let prisma

if (process.env.NODE_ENV === 'production') {
  // In production, create a new PrismaClient instance for each request to avoid issues with connection pooling.
  prisma = new PrismaClient({
    log: ['error', 'warn'] // Log errors and warnings for better visibility
  })
} else {
  // In development, use global object to avoid creating multiple instances
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['error'] // ['query', 'info', 'warn', 'error']
    })
  }
  prisma = global.prisma
}

export default prisma
