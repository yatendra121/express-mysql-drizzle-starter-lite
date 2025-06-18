import type { InferSelectModel } from 'drizzle-orm';
import { mysqlTable, timestamp, int, varchar } from "drizzle-orm/mysql-core"
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

export const users = mysqlTable('users', {
  id: int('id').notNull().primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email',{ length: 255 }).notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const selectUserSchema = createSelectSchema(users, {
  email: schema =>
    schema.regex(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/i),
});

export const verifyUserSchema = z.object({
  query: selectUserSchema.pick({
    email: true,
  }),
});

export const deleteUserSchema = z.object({
  body: selectUserSchema.pick({
    email: true,
  }),
});

export const loginSchema = z.object({
  body: selectUserSchema.pick({
    email: true,
  }),
});

export const addUserSchema = z.object({
  body: selectUserSchema.pick({
    name: true,
    email: true,
  }),
});

export const updateUserSchema = z.object({
  body: selectUserSchema
    .pick({
      name: true,
      email: true,
    })
    .partial(),
});

export const newUserSchema = z.object({
  body: selectUserSchema.pick({
    name: true,
    email: true,
  }),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = z.infer<typeof newUserSchema>['body'];
export type UpdateUser = z.infer<typeof updateUserSchema>['body'];
