// db.js
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT // Default port for PostgreSQL
})
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack)
  } else {
    console.log('Database connected successfully')
    release()
  }
})
export const query = (text, params) => {
  return pool.query(text, params)
}

export default pool
