CREATE TABLE `debts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`amount` real NOT NULL,
	`remaining` real NOT NULL,
	`currency` text NOT NULL,
	`dueDate` text,
	`isPaid` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `savings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`target` real NOT NULL,
	`current` real NOT NULL,
	`currency` text NOT NULL,
	`deadline` text
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text,
	`amount` real NOT NULL,
	`category` text NOT NULL,
	`subCategory` text,
	`tags` text,
	`type` text NOT NULL,
	`walletId` text NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`walletId`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`currency` text NOT NULL
);
