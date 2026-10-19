const { neon } = require('@neondatabase/serverless')

function getDb() {
  const url =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.STORAGE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING

  if (!url) {
    throw new Error('POSTGRES_URL environment variable is missing.')
  }

  return neon(url, { fullResults: true })
}

module.exports = { getDb }
