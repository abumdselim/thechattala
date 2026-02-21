import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({ connectionString: databaseUrl })
  }
  
  const adapter = new PrismaPg(globalForPrisma.pool)
  
  return new PrismaClient({ adapter })
}

// Lazily initialize the Prisma client on first access so that importing this
// module during the Next.js build (without a DATABASE_URL) does not throw.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient()
    }
    return (globalForPrisma.prisma as unknown as Record<string | symbol, unknown>)[prop]
  },
})
