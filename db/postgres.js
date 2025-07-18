import pg from 'pg'
const { Pool } = pg

export const getPostgresClient = async () => {
  const client = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
  })
  return client
}
