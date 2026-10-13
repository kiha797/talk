CREATE TABLE `hub_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`visibility` text NOT NULL,
	`scope` text DEFAULT '' NOT NULL,
	`data` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contacts_owner` ON `hub_contacts` (`owner`);--> statement-breakpoint
CREATE INDEX `contacts_scope` ON `hub_contacts` (`visibility`,`scope`);