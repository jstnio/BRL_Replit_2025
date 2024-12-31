import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

async function main() {
  console.log('Initializing database schema...');

  // Create roles
  console.log('Creating roles...');
  await db.insert(schema.roles).values([
    { name: 'admin', description: 'System administrator with full access' },
    { name: 'employee', description: 'Internal staff member' },
    { name: 'customer', description: 'Shipping client' },
    { name: 'customs_broker', description: 'Customs clearance specialist' },
    { name: 'international_agent', description: 'International shipping partner' },
    { name: 'trucker', description: 'Transportation provider' }
  ]);

  console.log('Database initialization completed');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});