/*
  Warnings:

  - You are about to drop the column `roomId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - The `time` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `reciever` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "roomId",
DROP COLUMN "userId",
ADD COLUMN     "reciever" TEXT NOT NULL,
ADD COLUMN     "sender" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "time",
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_reciever_fkey" FOREIGN KEY ("reciever") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
