CREATE TABLE `budgets` (
	`id` text PRIMARY KEY NOT NULL,
	`categoryId` text NOT NULL,
	`amount` real NOT NULL,
	`period` text NOT NULL,
	`updatedAt` text NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`type` text NOT NULL,
	`updatedAt` text NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recurring_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`amount` real NOT NULL,
	`categoryId` text,
	`walletId` text NOT NULL,
	`frequency` text NOT NULL,
	`startDate` text NOT NULL,
	`nextRunDate` text NOT NULL,
	`lastRunDate` text,
	`isActive` integer DEFAULT true NOT NULL,
	`updatedAt` text NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`walletId`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`amount` real NOT NULL,
	`categoryId` text,
	`category` text NOT NULL,
	`subCategory` text,
	`tags` text,
	`type` text NOT NULL,
	`walletId` text NOT NULL,
	`fromWalletId` text,
	`date` text NOT NULL,
	`isReconciled` integer DEFAULT false NOT NULL,
	`updatedAt` text NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`walletId`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "description", "amount", "categoryId", "category", "subCategory", "tags", "type", "walletId", "fromWalletId", "date", "isReconciled", "updatedAt", "isDeleted") SELECT "id", "description", "amount", "categoryId", "category", "subCategory", "tags", "type", "walletId", "fromWalletId", "date", "isReconciled", "updatedAt", "isDeleted" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_savings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`target` real NOT NULL,
	`current` real DEFAULT 0 NOT NULL,
	`currency` text NOT NULL,
	`deadline` text,
	`updatedAt` text NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_savings`("id", "name", "target", "current", "currency", "deadline", "updatedAt", "isDeleted") SELECT "id", "name", "target", "current", "currency", "deadline", "updatedAt", "isDeleted" FROM `savings`;--> statement-breakpoint
DROP TABLE `savings`;--> statement-breakpoint
ALTER TABLE `__new_savings` RENAME TO `savings`;