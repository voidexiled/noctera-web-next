/*
  Warnings:

  - A unique constraint covering the columns `[orderID]` on the table `wp_products_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `wp_products_orders_orderID_key` ON `wp_products_orders`(`orderID`);

-- CreateIndex
CREATE INDEX `orderID` ON `wp_products_orders`(`orderID`);
