import { z, ZodError } from 'zod';
import 'dotenv/config';

const configSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d{4,5}$/)
    .optional()
    .default('3000'),
  API_BASE_URL: z.string().url().default('/api'),
  DB_URL: z
    .string()
    .url()
    .refine(
      url => url.startsWith('mysql://') || url.startsWith('mysql://'),
      'DB_URL must be a valid mysql url'
    )
});

try {
  configSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    console.error(error.errors);
  }
  process.exit(1);
}

export type Env = z.infer<typeof configSchema>;
