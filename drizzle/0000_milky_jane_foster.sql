CREATE TABLE "biodatas" (
	"id" varchar PRIMARY KEY NOT NULL,
	"alias" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"npm" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"photo" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"linkedin" text NOT NULL,
	"github" text NOT NULL,
	"download_cv" text NOT NULL,
	"portofolio" text NOT NULL,
	"skills" jsonb NOT NULL,
	"style" jsonb NOT NULL,
	CONSTRAINT "biodatas_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"google_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
