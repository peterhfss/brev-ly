CREATE TABLE "short_urls" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_code" text NOT NULL,
	"clickCount" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"remote_key" text NOT NULL,
	"remote_url" text NOT NULL,
	CONSTRAINT "short_urls_remote_key_unique" UNIQUE("remote_key")
);
