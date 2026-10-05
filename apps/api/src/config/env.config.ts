import { z } from 'zod';
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  CORS_ORIGINS: z.string().default('http://localhost:5173').refine(value => value.split(',').every(origin => {
    try { return new URL(origin.trim()).origin === origin.trim(); } catch { return false; }
  })),
  THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});
export type EnvConfig = z.infer<typeof envSchema>;
export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) throw new Error('Invalid environment: ' + result.error.issues.map(issue => issue.path.join('.')).join(', '));
  return result.data;
}
