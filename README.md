# XenForo Forum Migration Script

A script to migrate forum threads and posts from a PostgreSQL database to a XenForo (MariaDB) database.

## Prerequisites

- Node.js >= 14
- Access to a local PostgreSQL database (with the dump restored)
- Access to the XenForo MariaDB database (local or remote)

## Configuration

1. Restore your PostgreSQL dump locally.
2. Copy `.env.example` to `.env` and fill in the credentials for both databases and `XF_NODE_ID`.
3. Install dependencies:

```bash
npm install dotenv pg mysql2
```

## Usage

By default, the script migrates the thread with ID 1. To migrate multiple threads, edit the last line of `migrate.js`:

```js
// To migrate multiple threads:
// [1,2,3].forEach(id => migrateThread(id))
```

Run the migration:

```bash
node migrate.js
```

## Migration Workflow

- Extracts threads and replies from PostgreSQL
- Converts HTML content to XenForo-compatible BBCode
- Inserts data into `xf_thread` and `xf_post` tables in MariaDB
- Uses transactions to ensure data integrity
- Logs progress and errors to the console

## Warnings & Recommendations

- Always take a full backup of your XenForo database before migrating
- This script is a starting point: it can be extended for idempotency (skip duplicates), advanced logging, tag/user migration, and concurrency
- Compatible with XenForo 2.x

## Possible Extensions

- Duplicate detection and skipping (idempotency)
- Tag and user relationship migration
- Detailed file-based logging
- Concurrent processing of multiple threads

## Contact

For questions, improvements, or support, contact Emilio Funes.

---

### Execution Demo (with troubleshooting)

1. **Install dependencies:**
   ```bash
   npm install dotenv pg mysql2
   ```

2. **If you see this error:**
   ```
   SyntaxError: Cannot use import statement outside a module
   ```
   **Solution:**  
   - Add `"type": "module"` to your `package.json`, or  
   - Rename `migrate.js` to `migrate.mjs` and run `node migrate.mjs`

3. **Run the migration:**
   ```bash
   node migrate.js
   ```

4. **Sample output:**
   ```
   Migrating thread ID 1...
   ✅ Thread 1 migrated successfully.
   ```

---

## GitHub Repo

This script is maintained by Emilio Funes. For inquiries or collaboration, feel free to reach out via Upwork or GitHub Issues.
