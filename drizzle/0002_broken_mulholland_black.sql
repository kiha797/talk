CREATE TABLE `cs_handoffs` (
	`code` text PRIMARY KEY NOT NULL,
	`session_ref` text NOT NULL,
	`expires` integer NOT NULL,
	`used` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` ADD `cs_scope` text DEFAULT '[]' NOT NULL;