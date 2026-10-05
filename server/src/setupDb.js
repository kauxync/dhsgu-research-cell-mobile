const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

async function runMigration() {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

  console.log(`[Migration] Connecting to Hostinger MySQL at ${DB_HOST}:${DB_PORT || 3306}...`);

  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: Number(DB_PORT) || 3306,
      multipleStatements: true
    });

    console.log('[Migration] Connection established. Executing schema.sql...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('[Migration] Schema created successfully!');

    console.log('[Migration] Executing seed.sql...');
    const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seedSql);
    console.log('[Migration] Seed data populated successfully!');

    await connection.end();
    console.log('[Migration] Database setup completed for Hostinger MySQL.');
  } catch (error) {
    console.error('[Migration Error]', error.message);
    process.exit(1);
  }
}

runMigration();

