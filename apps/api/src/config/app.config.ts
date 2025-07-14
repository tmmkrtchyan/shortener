import { z } from 'zod';

export const configSchema = z.object({
  DOMAIN_URL: z.url(),
  FRONT_URL: z.url(),
  DATABASE_URL: z.string(),
});

export function validateConfig(env: Record<string, any>) {
  const parsed = configSchema.safeParse(env);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map(i => i.message).join(', '));
  }
  return parsed.data;
}
