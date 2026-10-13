CREATE TABLE `hub_branding` (
	`id` text PRIMARY KEY NOT NULL,
	`object_key` text DEFAULT '' NOT NULL,
	`mime` text DEFAULT '' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated` integer NOT NULL
);
