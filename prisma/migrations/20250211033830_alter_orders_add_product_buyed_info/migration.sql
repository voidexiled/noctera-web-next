/*
  Warnings:

  - Added the required column `product_amount` to the `wp_products_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_category_id` to the `wp_products_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `wp_products_orders` ADD COLUMN `product_amount` INTEGER NOT NULL,
    ADD COLUMN `product_category_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `wp_products_orders` ADD CONSTRAINT `wp_products_orders_categories_fk` FOREIGN KEY (`product_category_id`) REFERENCES `wp_products_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
