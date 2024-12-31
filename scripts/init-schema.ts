import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function main() {
  console.log('Initializing database schema...');

  try {
    // Create initial roles
    console.log('Creating roles...');
    const roles = await db.insert(schema.roles).values([
      { name: 'admin', description: 'System administrator with full access' },
      { name: 'employee', description: 'Internal staff member' },
      { name: 'customer', description: 'Shipping client' },
      { name: 'customs_broker', description: 'Customs clearance specialist' },
      { name: 'international_agent', description: 'International shipping partner' },
      { name: 'trucker', description: 'Transportation provider' }
    ]).returning();

    // Create an admin user
    console.log('Creating admin user...');
    const adminPassword = await hashPassword('admin123');
    const adminRole = roles.find(role => role.name === 'admin');
    
    if (!adminRole) throw new Error('Admin role not found');

    const [adminUser] = await db.insert(schema.users).values({
      username: 'admin',
      password: adminPassword,
      email: 'admin@brlglobal.com',
      roleId: adminRole.id,
      active: true
    }).returning();

    // Create admin profile
    await db.insert(schema.admins).values({
      userId: adminUser.id,
      accessLevel: 'full',
      canManageUsers: true
    });

    console.log('Database initialization completed');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
