/*
  Warnings:

  - Made the column `stripe_id` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "stripe_id" SET NOT NULL;
