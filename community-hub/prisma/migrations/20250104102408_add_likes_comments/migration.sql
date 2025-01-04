/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Requirements` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Requirements` table. All the data in the column will be lost.
  - You are about to drop the column `competitors` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `foundedYear` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `fundingRaised` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `fundingRound` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `mrr` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `problemStatement` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `sam` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `tam` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `teamSize` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `techStack` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `interests` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SkillTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StartupApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudyGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudyGroupMember` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `startupId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `funding` to the `Startup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `market` to the `Startup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problem` to the `Startup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Startup` table without a default value. This is not possible if the table is not empty.
  - Made the column `traction` on table `Startup` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SkillTest" DROP CONSTRAINT "SkillTest_userId_fkey";

-- DropForeignKey
ALTER TABLE "StartupApplication" DROP CONSTRAINT "StartupApplication_startupId_fkey";

-- DropForeignKey
ALTER TABLE "StartupApplication" DROP CONSTRAINT "StartupApplication_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudyGroupMember" DROP CONSTRAINT "StudyGroupMember_studyGroupId_fkey";

-- DropForeignKey
ALTER TABLE "StudyGroupMember" DROP CONSTRAINT "StudyGroupMember_userId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "startupId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Requirements" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Startup" DROP COLUMN "competitors",
DROP COLUMN "foundedYear",
DROP COLUMN "fundingRaised",
DROP COLUMN "fundingRound",
DROP COLUMN "logo",
DROP COLUMN "mrr",
DROP COLUMN "problemStatement",
DROP COLUMN "sam",
DROP COLUMN "stage",
DROP COLUMN "tam",
DROP COLUMN "teamSize",
DROP COLUMN "techStack",
ADD COLUMN     "funding" TEXT NOT NULL,
ADD COLUMN     "market" TEXT NOT NULL,
ADD COLUMN     "problem" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "traction" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "interests",
DROP COLUMN "role",
DROP COLUMN "skills",
DROP COLUMN "verified";

-- DropTable
DROP TABLE "SkillTest";

-- DropTable
DROP TABLE "StartupApplication";

-- DropTable
DROP TABLE "StudyGroup";

-- DropTable
DROP TABLE "StudyGroupMember";

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dislike" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dislike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Like_startupId_idx" ON "Like"("startupId");

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_startupId_userId_key" ON "Like"("startupId", "userId");

-- CreateIndex
CREATE INDEX "Dislike_startupId_idx" ON "Dislike"("startupId");

-- CreateIndex
CREATE INDEX "Dislike_userId_idx" ON "Dislike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Dislike_startupId_userId_key" ON "Dislike"("startupId", "userId");

-- CreateIndex
CREATE INDEX "Comment_startupId_idx" ON "Comment"("startupId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Application_startupId_idx" ON "Application"("startupId");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- CreateIndex
CREATE INDEX "Application_positionId_idx" ON "Application"("positionId");

-- CreateIndex
CREATE INDEX "Position_startupId_idx" ON "Position"("startupId");

-- CreateIndex
CREATE INDEX "Startup_userId_idx" ON "Startup"("userId");

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
