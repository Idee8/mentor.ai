import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const waitlistusers = pgTable("waitlist_users", {
  id: uuid("id").default(sql`gen_random_uuid()`),
  email: varchar("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }),
});
