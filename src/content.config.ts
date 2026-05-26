import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    code: z.string(),
    eyebrow: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    audience: z.array(z.string()),
    deliverables: z.array(z.string()),
    process: z.array(z.object({ step: z.string(), title: z.string(), body: z.string() })),
    faq: z.array(z.object({ q: z.string(), a: z.string() })),
    metric: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

const atletas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/atletas' }),
  schema: z.object({
    name: z.string(),
    discipline: z.string(),
    category: z.string(),
    photo: z.string(),
    quote: z.string().optional(),
    achievements: z.array(z.string()),
    sponsors: z.array(z.string()).optional(),
    social: z.object({ instagram: z.string().optional(), twitter: z.string().optional() }).optional(),
    year: z.number().optional(),
  }),
});

export const collections = { servicios, atletas };
