import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().default(''),
  NEXTAUTH_SECRET: z.string().default(''),
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),
  UPLOADTHING_SECRET: z.string().default(''),
  UPLOADTHING_APP_ID: z.string().default(''),
  REDIS_URL: z.string().default(''),
  REDIS_SECRET: z.string().default(''),
});

export type Environment = z.infer<typeof environmentSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {}
  }
}
