import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/talibon_workspace'),
  SUPABASE_URL: z.string().default('https://your-project.supabase.co'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('mock-service-role-key'),
  SUPABASE_JWT_SECRET: z.string().default('mock-jwt-secret'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.format());
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: process.env.PORT || 3000,
      HOST: process.env.HOST || '0.0.0.0',
    });
  }
  return result.data;
}
