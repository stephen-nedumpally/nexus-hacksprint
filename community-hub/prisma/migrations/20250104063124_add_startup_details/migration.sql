/*
  Warnings:

  - You are about to drop the column `fundingAmount` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `locations` on the `Startup` table. All the data in the column will be lost.
  - Made the column `competitors` on table `Startup` required. This step will fail if there are existing NULL values in that column.
  - Made the column `problemStatement` on table `Startup` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sam` on table `Startup` required. This step will fail if there are existing NULL values in that column.
  - Made the column `solution` on table `Startup` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stage` on table `Startup` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tam` on table `Startup` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Startup" DROP COLUMN "fundingAmount",
DROP COLUMN "locations",
ADD COLUMN     "fundingRaised" DOUBLE PRECISION,
ADD COLUMN     "logo" TEXT,
ALTER COLUMN "competitors" SET NOT NULL,
ALTER COLUMN "mrr" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "problemStatement" SET NOT NULL,
ALTER COLUMN "sam" SET NOT NULL,
ALTER COLUMN "solution" SET NOT NULL,
ALTER COLUMN "stage" SET NOT NULL,
ALTER COLUMN "tam" SET NOT NULL,
ALTER COLUMN "techStack" DROP DEFAULT;
