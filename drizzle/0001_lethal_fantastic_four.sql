ALTER TABLE `debts` ADD `updatedAt` text NOT NULL;--> statement-breakpoint
ALTER TABLE `debts` ADD `isDeleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `savings` ADD `updatedAt` text NOT NULL;--> statement-breakpoint
ALTER TABLE `savings` ADD `isDeleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` ADD `fromWalletId` text REFERENCES wallets(id);--> statement-breakpoint
ALTER TABLE `transactions` ADD `updatedAt` text NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` ADD `isDeleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `wallets` ADD `initialBalance` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `wallets` ADD `updatedAt` text NOT NULL;--> statement-breakpoint
ALTER TABLE `wallets` ADD `isDeleted` integer DEFAULT false NOT NULL;