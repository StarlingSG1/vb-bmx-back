/*
  Warnings:

  - A unique constraint covering the columns `[stripe_id]` on the table `Commande` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripe_id` to the `Commande` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Commande" ADD COLUMN     "stripe_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Commande_stripe_id_key" ON "Commande"("stripe_id");
