CREATE TABLE "waitlist_users" (
	"id" uuid DEFAULT gen_random_uuid(),
	"email" varchar NOT NULL,
	"created_at" timestamp
);
