CREATE TYPE "public"."file_type" AS ENUM('document', 'image', 'video', 'audio', 'sheet');--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"type" "file_type" NOT NULL,
	"mimeType" varchar(100) NOT NULL,
	"size" bigint NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"uploadedBy" uuid,
	CONSTRAINT "files_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatarUrl" text;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_uploadedBy_users_id_fk" FOREIGN KEY ("uploadedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;