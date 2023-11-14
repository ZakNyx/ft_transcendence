/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `interactedWith` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `matchId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Notification` table. All the data in the column will be lost.
  - Made the column `reciever` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sender` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "UserNotifications";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "UserParticipantNotifs";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "createdAt",
DROP COLUMN "interactedWith",
DROP COLUMN "matchId",
DROP COLUMN "read",
DROP COLUMN "roomId",
DROP COLUMN "senderId",
DROP COLUMN "updatedAt",
ALTER COLUMN "reciever" SET NOT NULL,
ALTER COLUMN "sender" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "data" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "UserNotifications" FOREIGN KEY ("reciever") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "UserParticipantNotifs" FOREIGN KEY ("reciever") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
