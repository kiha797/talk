CREATE TABLE `leave_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`hire_date` text NOT NULL,
	`period_start` text NOT NULL,
	`period_end` text NOT NULL,
	`grant_units` integer DEFAULT 0 NOT NULL,
	`prior_used_units` integer DEFAULT 0 NOT NULL,
	`confirmed` integer DEFAULT 0 NOT NULL,
	`default_line` text DEFAULT '[]' NOT NULL,
	`processors` text DEFAULT '[]' NOT NULL,
	`workdays` text DEFAULT '[1,2,3,4,5]' NOT NULL,
	`holidays` text DEFAULT '[]' NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `approval_documents` ADD `references` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `approval_documents` ADD `leave_data` text DEFAULT '{}' NOT NULL;