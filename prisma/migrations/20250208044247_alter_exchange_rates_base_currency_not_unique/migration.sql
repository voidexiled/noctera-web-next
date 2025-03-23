/*
  Warnings:

  - You are about to alter the column `rate` on the `exchange_rates` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.

*/
-- DropIndex
DROP INDEX `exchange_rates_base_currency_key` ON `exchange_rates`;

-- AlterTable
ALTER TABLE `exchange_rates` MODIFY `rate` DECIMAL NOT NULL DEFAULT 0;
