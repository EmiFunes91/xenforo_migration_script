import mysql from 'mysql2/promise'

export const getMariaDBConnection = async () => {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD
  })
}

export const beginTransaction = async (conn) => await conn.beginTransaction()
export const rollback = async (conn) => await conn.rollback()
export const commit = async (conn) => await conn.commit()
