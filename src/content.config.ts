import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const settings = defineCollection({
  loader: glob({ pattern: "site.md", base: "./src/content/settings" }),
  schema: z.object({
    brand_name: z.string(),
    logo: z.string().optional().default(""),
    hero_title: z.string(),
    hero_subtitle: z.string(),
    hero_image: z.string().optional().default(""),
    hero_eyebrow: z.string(),
    host_note: z.string(),
    tally_form_url: z.string().optional().default(""),
    wechat_qr: z.string().optional().default(""),
    contact_email: z.string().email().optional().or(z.literal("")).default(""),
    footer_text: z.string(),
    seo_title: z.string(),
    seo_description: z.string(),
  }),
});

const homeBlocks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/home-blocks" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional().default(""),
    body: z.string().optional().default(""),
    image: z.string().optional().default(""),
    layout: z.enum(["left", "right", "full"]).default("left"),
    theme: z.enum(["dark", "light", "paper"]).default("paper"),
    show: z.boolean().default(true),
    order: z.number().default(0),
    button_text: z.string().optional().default(""),
    button_link: z.string().optional().default(""),
  }),
});

const teaEvents = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tea-events" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional().default(""),
    slug: z.string(),
    season: z.string(),
    date: z.coerce.date(),
    city: z.string(),
    venue_note: z.string().optional().default(""),
    seats: z.string(),
    price: z.string(),
    status: z.enum(["open", "waitlist", "full", "closed"]),
    status_label: z.string(),
    tea_types: z.array(z.string()).default([]),
    objects: z.array(z.string()).default([]),
    host: z.string().optional().default(""),
    suitable_for: z.array(z.string()).default([]),
    summary: z.string(),
    description: z.string().optional().default(""),
    cover_image: z.string().optional().default(""),
    gallery: z.array(z.string()).default([]),
    featured_on_home: z.boolean().default(false),
    seo_title: z.string().optional().default(""),
    seo_description: z.string().optional().default(""),
  }),
});

const objects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/objects" }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    category: z.string(),
    material: z.string(),
    origin: z.string().optional().default(""),
    texture_note: z.string(),
    use_case: z.string(),
    image: z.string().optional().default(""),
    description: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    summary: z.string(),
    cover_image: z.string().optional().default(""),
    featured: z.boolean().default(false),
    seo_title: z.string().optional().default(""),
    seo_description: z.string().optional().default(""),
  }),
});

export const collections = { settings, homeBlocks, teaEvents, objects, notes };
