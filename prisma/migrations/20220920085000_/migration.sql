/*
  Warnings:

  - A unique constraint covering the columns `[stripe_id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stripe_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_stripe_id_key" ON "Product"("stripe_id");
