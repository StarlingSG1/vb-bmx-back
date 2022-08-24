/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Commande` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Commande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Commande` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Commande" ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Commande_number_key" ON "Commande"("number");
