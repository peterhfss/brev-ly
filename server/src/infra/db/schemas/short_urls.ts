import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from 'uuidv7'

export const short_urls = pgTable('short_urls', {
    id: text('id').primaryKey().$defaultFn(() => uuidv7()),
    originalUrl: text('original_url').notNull(),
    shortCode: text('short_code').notNull(),
    clickCount: numeric(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    remoteKey: text('remote_key').notNull().unique(),
    remoteUrl: text('remote_url').notNull(),
})