ALTER TABLE "short_urls" RENAME COLUMN "clickCount" TO "access_count";--> statement-breakpoint
ALTER TABLE "short_urls" DROP CONSTRAINT "short_urls_remote_key_unique";--> statement-breakpoint
ALTER TABLE "short_urls" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "short_urls" DROP COLUMN "remote_key";--> statement-breakpoint
ALTER TABLE "short_urls" DROP COLUMN "remote_url";