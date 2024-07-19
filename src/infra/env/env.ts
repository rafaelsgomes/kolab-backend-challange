import { z } from 'zod'

export const envSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_SYNCHRONIZE: z.coerce.boolean().default(false),
})

export type Env = z.infer<typeof envSchema>
