CREATE TABLE `hub_mail` (
	`id` text PRIMARY KEY NOT NULL,
	`sender` text NOT NULL,
	`data` text NOT NULL,
	`state` text NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hub_mail_entries` (
	`message` text NOT NULL,
	`user` text NOT NULL,
	`folder` text NOT NULL,
	`read` integer DEFAULT 0 NOT NULL,
	`star` integer DEFAULT 0 NOT NULL,
	`label` text DEFAULT '' NOT NULL,
	PRIMARY KEY(`message`, `user`)
);
--> statement-breakpoint
CREATE INDEX `mail_user_folder` ON `hub_mail_entries` (`user`,`folder`);--> statement-breakpoint
CREATE TABLE `hub_mail_files` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`size` integer NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hub_mail_settings` (
	`user` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
