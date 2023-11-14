/*
  Warnings:

  - You are about to drop the column `reciever` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `data` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "UserNotifications";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "UserParticipantNotifs";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "data" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "reciever",
DROP COLUMN "sender",
DROP COLUMN "type",
ADD COLUMN     "roomId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "time" DROP DEFAULT,
ALTER COLUMN "time" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
