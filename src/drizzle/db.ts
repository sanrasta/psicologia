import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Check for the environment variable and provide an error message
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set. Please check your .env file.");
}

// Create a noop function that returns empty arrays or the desired value
const noop = () => ({ 
  where: () => ({ 
    execute: () => Promise.resolve([]) 
  }),
  execute: () => Promise.resolve([])
});

// Define a fallback db object that mimics the structure needed by the app
let db: any = {
  query: {
    EventTable: {
      findMany: async () => [],
      findFirst: async () => null
    },
    ScheduleTable: {
      findFirst: async () => null
    }
  },
  // For regular query operations
  select: (fields: any) => ({
    from: (table: any) => ({
      where: () => Promise.resolve([{ count: 0 }]),
      execute: () => Promise.resolve([{ count: 0 }])
    })
  }),
  // For insert operations
  insert: (table: any) => ({
    values: (values: any) => Promise.resolve()
  }),
  // For delete operations
  delete: (table: any) => ({
    where: () => Promise.resolve()
  })
};

// Wrap database initialization in a try-catch block
try {
  // Create a SQL connection to the database
  const sql = neon(process.env.DATABASE_URL!);
  
  // Initialize the Drizzle ORM with the SQL connection and schema
  db = drizzle({ client: sql, schema });
  console.log("Database connection initialized successfully");
} catch (error) {
  console.error("Error initializing database connection:", error);
  console.log("Using fallback database object");
}

export { db };

