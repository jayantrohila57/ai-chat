CREATE TABLE "ai_model" (
	"id" text PRIMARY KEY NOT NULL,
	"provider" text NOT NULL,
	"provider_model" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"plan_code" text DEFAULT 'free' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"supports_reasoning" boolean DEFAULT false NOT NULL,
	"credit_multiplier_bps" integer DEFAULT 10000 NOT NULL,
	"context_window" integer,
	"max_output_tokens" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_message" ADD COLUMN "reasoning" text;--> statement-breakpoint
ALTER TABLE "chat_message" ADD COLUMN "reasoning_tokens" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_message" ADD COLUMN "summary_version_used" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_thread" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "chat_thread" ADD COLUMN "summary_version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_thread" ADD COLUMN "summary_updated_at" timestamp with time zone;--> statement-breakpoint
CREATE UNIQUE INDEX "ai_model_provider_model_unique_idx" ON "ai_model" USING btree ("provider","provider_model");--> statement-breakpoint
CREATE INDEX "ai_model_plan_sort_idx" ON "ai_model" USING btree ("plan_code","sort_order");