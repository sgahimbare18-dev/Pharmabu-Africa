CREATE TABLE `family_doctor_services` (
	`id` text PRIMARY KEY NOT NULL,
	`pharmacy_id` text NOT NULL,
	`pharmacy_name` text NOT NULL,
	`pharmacist_name` text NOT NULL,
	`description` text,
	`monthly_fee` real NOT NULL,
	`services_included` text,
	`is_available` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `family_pharmacists` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`patient_name` text NOT NULL,
	`pharmacy_id` text NOT NULL,
	`pharmacy_name` text NOT NULL,
	`pharmacist_name` text NOT NULL,
	`status` text DEFAULT 'pending_payment' NOT NULL,
	`monthly_fee` real NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`payment_method` text,
	`payment_date` text,
	`next_payment_date` text,
	`assigned_at` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `medications` (
	`id` text PRIMARY KEY NOT NULL,
	`pharmacy_id` text NOT NULL,
	`name` text NOT NULL,
	`generic_name` text,
	`description` text,
	`what_it_cures` text,
	`dosage` text,
	`usage_instructions` text,
	`side_effects` text,
	`price` real NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`category` text,
	`image_url` text,
	`requires_prescription` integer DEFAULT false,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`pharmacy_id` text NOT NULL,
	`pharmacy_name` text NOT NULL,
	`pharmacist_name` text NOT NULL,
	`subject` text NOT NULL,
	`content` text NOT NULL,
	`status` text DEFAULT 'unread' NOT NULL,
	`type` text DEFAULT 'general' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`patient_name` text NOT NULL,
	`patient_phone` text NOT NULL,
	`pharmacy_id` text NOT NULL,
	`pharmacy_name` text NOT NULL,
	`medication_id` text NOT NULL,
	`medication_name` text NOT NULL,
	`medication_price` real NOT NULL,
	`quantity` integer NOT NULL,
	`total_price` real NOT NULL,
	`symptoms` text,
	`pharmacy_notes` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_method` text DEFAULT 'pay_on_delivery' NOT NULL,
	`delivery_address` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`medication_id`) REFERENCES `medications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `patient_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date_of_birth` text,
	`age` integer,
	`gender` text,
	`address` text,
	`city` text,
	`country` text,
	`occupation` text,
	`education_level` text,
	`profile_picture` text,
	`emergency_contact_name` text,
	`emergency_contact_phone` text,
	`medical_notes` text,
	`allergies` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `patient_profiles_user_id_unique` ON `patient_profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `patient_records` (
	`id` text PRIMARY KEY NOT NULL,
	`pharmacy_id` text NOT NULL,
	`patient_id` text NOT NULL,
	`patient_name` text NOT NULL,
	`patient_sex` text,
	`patient_age` integer,
	`patient_location` text,
	`visit_date` text NOT NULL,
	`reason_for_visit` text,
	`symptoms` text,
	`diagnosis` text,
	`medication_given` text,
	`medication_dosage` text,
	`reason_for_medication` text,
	`pharmacist_notes` text,
	`follow_up_date` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`patient_id` text NOT NULL,
	`patient_name` text NOT NULL,
	`patient_phone` text NOT NULL,
	`pharmacy_id` text NOT NULL,
	`pharmacy_name` text NOT NULL,
	`medication_name` text NOT NULL,
	`quantity` integer NOT NULL,
	`original_amount` real NOT NULL,
	`original_currency` text NOT NULL,
	`exchange_rate` real NOT NULL,
	`amount_in_kes` real NOT NULL,
	`platform_fee` real NOT NULL,
	`pharmacy_payout` real NOT NULL,
	`admin_phone` text NOT NULL,
	`payment_method` text NOT NULL,
	`payment_reference` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_message` text,
	`payout_status` text DEFAULT 'pending' NOT NULL,
	`payout_reference` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pharmacies` (
	`id` text PRIMARY KEY NOT NULL,
	`pharmacy_name` text NOT NULL,
	`pharmacist_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`license_number` text NOT NULL,
	`pharmacist_qualification` text NOT NULL,
	`pharmacist_university` text,
	`pharmacist_graduation_year` text,
	`pharmacy_reg_number` text NOT NULL,
	`pharmacy_reg_authority` text NOT NULL,
	`pharmacy_reg_expiry` text,
	`country` text NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`operating_hours` text,
	`services_offered` text,
	`license_document` text,
	`qualification_document` text,
	`pharmacy_reg_document` text,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'pharmacy' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pharmacy_staff` (
	`id` text PRIMARY KEY NOT NULL,
	`pharmacy_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`role` text NOT NULL,
	`qualification` text,
	`license_number` text,
	`is_active` integer DEFAULT true NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `prescriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`patient_name` text NOT NULL,
	`pharmacy_id` text NOT NULL,
	`pharmacy_name` text NOT NULL,
	`medication_name` text NOT NULL,
	`dosage` text NOT NULL,
	`quantity` integer NOT NULL,
	`instructions` text,
	`prescriber_name` text,
	`prescriber_license` text,
	`document_url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `profile_update_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`user_email` text NOT NULL,
	`requested_fields` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`admin_notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`patient_name` text NOT NULL,
	`patient_phone` text NOT NULL,
	`pharmacy_id` text NOT NULL,
	`pharmacy_name` text NOT NULL,
	`pharmacy_city` text NOT NULL,
	`subscription_type` text DEFAULT 'monthly' NOT NULL,
	`monthly_amount` real NOT NULL,
	`delivery_address` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`country` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'patient' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);