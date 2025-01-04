/*
  Warnings:

  - You are about to drop the column `founded` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the `Requirements` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `location` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualifications` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsibilities` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Requirements" DROP CONSTRAINT "Requirements_positionId_fkey";

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "equity" TEXT,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "qualifications" TEXT NOT NULL,
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "responsibilities" TEXT NOT NULL,
ADD COLUMN     "stipend" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'FULL_TIME';

-- AlterTable
ALTER TABLE "Startup" DROP COLUMN "founded",
ADD COLUMN     "foundedYear" INTEGER NOT NULL DEFAULT 2024,
ADD COLUMN     "logo" TEXT,
ALTER COLUMN "traction" DROP NOT NULL,
ALTER COLUMN "funding" DROP NOT NULL;

-- DropTable
DROP TABLE "Requirements";
