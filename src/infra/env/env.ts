import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['test', 'development', 'production']).default('production'),
  PORT: z.coerce.number().default(3000),
  PRIVATE_KEY: z.string(),
  PUBLIC_KEY: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_SCHEMA: z.string().default('public'),
})

export type Env = z.infer<typeof envSchema>
