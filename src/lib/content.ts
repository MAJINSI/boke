import type { CollectionEntry } from "astro:content";

export const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function byDateDesc<T extends { data: { date: Date } }>(items: T[]) {
  return [...items].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function byOrder<T extends { data: { order?: number } }>(items: T[]) {
  return [...items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
}

export function getSetting(settings: CollectionEntry<"settings">[]) {
  return settings[0]?.data;
}

export function eventHref(event: CollectionEntry<"teaEvents">) {
  return `/tea-events/${event.data.slug}`;
}

export function noteHref(note: CollectionEntry<"notes">) {
  return `/notes/${note.data.slug}`;
}
