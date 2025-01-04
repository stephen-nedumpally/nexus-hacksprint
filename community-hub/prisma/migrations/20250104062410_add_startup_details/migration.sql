/*
  Warnings:

  - You are about to drop the column `logo` on the `Startup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Startup" DROP COLUMN "logo",
ADD COLUMN     "competitors" INTEGER,
ADD COLUMN     "fundingAmount" DOUBLE PRECISION,
ADD COLUMN     "fundingRound" TEXT,
ADD COLUMN     "locations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mrr" INTEGER,
ADD COLUMN     "problemStatement" TEXT,
ADD COLUMN     "sam" DOUBLE PRECISION,
ADD COLUMN     "solution" TEXT,
ADD COLUMN     "stage" TEXT,
ADD COLUMN     "tam" DOUBLE PRECISION,
ADD COLUMN     "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "traction" TEXT,
ALTER COLUMN "teamSize" DROP DEFAULT;
