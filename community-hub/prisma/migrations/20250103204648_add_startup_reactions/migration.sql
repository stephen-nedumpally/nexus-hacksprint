/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Startup` table without a default value. This is not possible if the table is not empty.

*/
-- Create the new tables first
CREATE TABLE "StartupReaction" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupReaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StartupComment" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupComment_pkey" PRIMARY KEY ("id")
);

-- Get a user ID to use as default (you should replace this with an actual user ID)
DO $$ 
DECLARE
    default_user_id TEXT;
BEGIN
    SELECT id INTO default_user_id FROM "User" LIMIT 1;
    
    -- Add the userId column to Startup table with a default value
    ALTER TABLE "Startup" ADD COLUMN "userId" TEXT;
    UPDATE "Startup" SET "userId" = default_user_id WHERE "userId" IS NULL;
    ALTER TABLE "Startup" ALTER COLUMN "userId" SET NOT NULL;
END $$;

-- Add unique constraint to StartupReaction
CREATE UNIQUE INDEX "StartupReaction_startupId_userId_key" ON "StartupReaction"("startupId", "userId");

-- Add foreign key constraints
ALTER TABLE "StartupReaction" ADD CONSTRAINT "StartupReaction_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StartupReaction" ADD CONSTRAINT "StartupReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "StartupComment" ADD CONSTRAINT "StartupComment_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StartupComment" ADD CONSTRAINT "StartupComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Startup" ADD CONSTRAINT "Startup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified";
