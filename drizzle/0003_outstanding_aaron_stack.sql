CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`entity_id` text NOT NULL,
	`actor` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`created` integer NOT NULL,
	`read_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `notifications_user_created` ON `notifications` (`user_id`,`created`);--> statement-breakpoint
CREATE INDEX `notifications_user_read` ON `notifications` (`user_id`,`read_at`);--> statement-breakpoint
CREATE TABLE `room_reads` (
	`room` text NOT NULL,
	`user_id` text NOT NULL,
	`last_created` integer DEFAULT 0 NOT NULL,
	`last_id` text DEFAULT '' NOT NULL,
	PRIMARY KEY(`room`, `user_id`)
);
