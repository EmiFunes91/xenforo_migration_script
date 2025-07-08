// Migration script for threads and posts from PostgreSQL to XenForo (MariaDB)
// Author: Emilio Funes
// This script can be extended for idempotency, tag migration, advanced logging, and concurrency.

import { getPostgresClient } from './db/postgres.js'
import { getMariaDBConnection, beginTransaction, rollback, commit } from './db/mariadb.js'
import { convertHtmlToBBCode } from './utils/convertHtmlToBBCode.js'
import dotenv from 'dotenv'

dotenv.config()

// Main migration function for a single thread
async function migrateThread(threadId) {
  const pg = await getPostgresClient()
  const mariadb = await getMariaDBConnection()

  try {
    await beginTransaction(mariadb)
    console.log(`Migrating thread ID ${threadId}...`)

    // 1. Fetch thread data from PostgreSQL
    const threadRes = await pg.query('SELECT * FROM threads WHERE id = $1', [threadId])
    const thread = threadRes.rows[0]

    // 2. Fetch replies for the thread
    const repliesRes = await pg.query('SELECT * FROM replies WHERE thread_id = $1 ORDER BY created_at ASC', [threadId])
    const replies = repliesRes.rows

    // 3. (Optional) Check if the thread already exists in MariaDB for idempotency
    // const [existing] = await mariadb.execute('SELECT thread_id FROM xf_thread WHERE title = ? AND user_id = ?', [thread.title, thread.author_id])
    // if (existing.length > 0) {
    //   console.log(`Thread already exists, skipping...`)
    //   await commit(mariadb)
    //   return
    // }

    // 4. Convert the first post to BBCode
    const bbcodeFirstPost = convertHtmlToBBCode(replies[0].content)

    // 5. Insert the thread into MariaDB
    const [threadInsert] = await mariadb.execute(
      `INSERT INTO xf_thread (node_id, title, user_id, username, post_date)
       VALUES (?, ?, ?, ?, ?)`,
      [
        process.env.XF_NODE_ID,
        thread.title,
        thread.author_id,
        thread.author_username,
        Math.floor(new Date(thread.created_at).getTime() / 1000)
      ]
    )

    const threadIdNew = threadInsert.insertId

    // 6. Insert each reply as a post in MariaDB
    for (let i = 0; i < replies.length; i++) {
      const reply = replies[i]
      const bbcode = convertHtmlToBBCode(reply.content)

      await mariadb.execute(
        `INSERT INTO xf_post (thread_id, user_id, username, message, post_date)
         VALUES (?, ?, ?, ?, ?)`,
        [
          threadIdNew,
          reply.author_id,
          reply.author_username,
          bbcode,
          Math.floor(new Date(reply.created_at).getTime() / 1000)
        ]
      )
    }

    await commit(mariadb)
    console.log(`✅ Thread ${threadId} migrated successfully.`)
  } catch (error) {
    await rollback(mariadb)
    console.error(`❌ Error migrating thread ${threadId}:`, error)
  } finally {
    await pg.end()
    await mariadb.end()
  }
}

// Example: migrate a single thread
migrateThread(1)
