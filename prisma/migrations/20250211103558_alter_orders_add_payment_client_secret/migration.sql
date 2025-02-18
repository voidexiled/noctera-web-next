/*
  Warnings:

  - You are about to drop the column `paymentID` on the `wp_products_orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentClientSecret]` on the table `wp_products_orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentClientSecret` to the `wp_products_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `wp_products_orders` DROP COLUMN `paymentID`,
    ADD COLUMN `paymentClientSecret` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `wp_products_orders_paymentClientSecret_key` ON `wp_products_orders`(`paymentClientSecret`);
