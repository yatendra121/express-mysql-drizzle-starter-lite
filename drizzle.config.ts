import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/*',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
} satisfies Config;
