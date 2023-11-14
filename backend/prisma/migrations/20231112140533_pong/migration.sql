/*
  Warnings:

  - You are about to drop the column `sender` on the `Message` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sender_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "sender",
ADD COLUMN     "senderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "interactedWith" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "matchId" INTEGER,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roomId" INTEGER,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "friendRequest" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,

    CONSTRAINT "friendRequest_pkey" PRIMARY KEY ("id")
);

-- RenameForeignKey
ALTER TABLE "Notification" RENAME CONSTRAINT "Notification_reciever_fkey" TO "UserNotifications";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
