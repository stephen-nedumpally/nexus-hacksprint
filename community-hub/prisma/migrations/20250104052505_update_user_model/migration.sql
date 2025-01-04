/*
  Warnings:

  - You are about to drop the column `userId` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the `StartupComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StartupReaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Startup" DROP CONSTRAINT "Startup_userId_fkey";

-- DropForeignKey
ALTER TABLE "StartupComment" DROP CONSTRAINT "StartupComment_startupId_fkey";

-- DropForeignKey
ALTER TABLE "StartupComment" DROP CONSTRAINT "StartupComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "StartupReaction" DROP CONSTRAINT "StartupReaction_startupId_fkey";

-- DropForeignKey
ALTER TABLE "StartupReaction" DROP CONSTRAINT "StartupReaction_userId_fkey";

-- AlterTable
ALTER TABLE "Startup" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'student',
ADD COLUMN     "skills" TEXT[],
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "StartupComment";

-- DropTable
DROP TABLE "StartupReaction";
