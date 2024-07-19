import { randomUUID } from 'node:crypto'

beforeAll(() => {
  const schema = randomUUID()
  process.env.DB_SCHEMA = schema
})
