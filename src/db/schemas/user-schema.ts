import { pgTable, text, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: text().notNull(),
  },
  (table) => {
    return {
      emailIndex: uniqueIndex().on(table.email),
    };
  }
);
