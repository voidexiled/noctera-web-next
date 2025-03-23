/*
  Warnings:

  - You are about to alter the column `rate` on the `exchange_rates` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal(30,16)`.

*/
-- AlterTable
ALTER TABLE `exchange_rates` MODIFY `rate` DECIMAL(30, 16) NOT NULL DEFAULT 0;
