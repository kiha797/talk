CREATE TABLE `mfa_challenges` (
	`token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`secret` text DEFAULT '' NOT NULL,
	`generation` text NOT NULL,
	`password_ref` text NOT NULL,
	`remember` integer DEFAULT 0 NOT NULL,
	`expires` integer NOT NULL,
	`used` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `mfa_challenge_user` ON `mfa_challenges` (`user_id`);--> statement-breakpoint
CREATE TABLE `remembered_devices` (
	`token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`password_ref` text NOT NULL,
	`generation` text NOT NULL,
	`label` text NOT NULL,
	`created` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `remembered_user` ON `remembered_devices` (`user_id`);--> statement-breakpoint
CREATE TABLE `security_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`target` text NOT NULL,
	`action` text NOT NULL,
	`reason` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_mfa` (
	`user_id` text PRIMARY KEY NOT NULL,
	`secret` text NOT NULL,
	`generation` text NOT NULL,
	`last_step` integer DEFAULT -1 NOT NULL,
	`recovery` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `sessions` ADD `mfa_verified` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD `mfa_generation` text DEFAULT '' NOT NULL;
--> statement-breakpoint
DELETE FROM sessions;
