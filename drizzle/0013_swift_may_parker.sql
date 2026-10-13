CREATE TABLE `hub_app_releases` (
	`platform` text PRIMARY KEY NOT NULL,
	`version_code` integer NOT NULL,
	`version` text NOT NULL,
	`object_key` text NOT NULL,
	`sha256` text NOT NULL,
	`size` integer NOT NULL,
	`notes` text NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hub_app_upload_parts` (
	`upload` text NOT NULL,
	`part` integer NOT NULL,
	`etag` text NOT NULL,
	`size` integer NOT NULL,
	PRIMARY KEY(`upload`, `part`)
);
--> statement-breakpoint
CREATE TABLE `hub_app_uploads` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`platform` text NOT NULL,
	`version_code` integer NOT NULL,
	`version` text NOT NULL,
	`object_key` text NOT NULL,
	`upload_id` text NOT NULL,
	`sha256` text NOT NULL,
	`size` integer NOT NULL,
	`notes` text NOT NULL,
	`created` integer NOT NULL
);
