import { pgTable, varchar, timestamp, text, jsonb } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("users", {
  id: varchar("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  googleId: varchar("google_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const biodatas = pgTable("biodatas", {
  id: varchar("id").primaryKey(),
  alias: varchar("alias", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  npm: varchar("npm", { length: 50 }).notNull(),
  description: text("description").notNull(),
  photo: text("photo").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  linkedin: text("linkedin").notNull(),
  github: text("github").notNull(),
  downloadCv: text("download_cv").notNull(),
  portofolio: text("portofolio").notNull(),
  skills: jsonb("skills").$type<string[]>().notNull(),
  style: jsonb("style").$type<{ lightColor: string; darkColor: string; fontFamily: string; bgColor: string }>().notNull(),
});

export const table = { users, biodatas } as const;
export type Table = typeof table;
