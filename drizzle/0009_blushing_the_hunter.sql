CREATE TABLE `presence_policy` (
	`id` text PRIMARY KEY NOT NULL,
	`max_minutes` integer DEFAULT 60 NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `presence_preferences` (
	`user_id` text PRIMARY KEY NOT NULL,
	`minutes` integer DEFAULT 10 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `presence_sessions` (
	`session_token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`last_active` integer NOT NULL,
	`heartbeat` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `presence_user` ON `presence_sessions` (`user_id`);