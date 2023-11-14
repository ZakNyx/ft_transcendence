-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "UserNotifications";

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "reciever" DROP NOT NULL,
ALTER COLUMN "type" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "UserNotifications" FOREIGN KEY ("reciever") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "UserParticipantNotifs" FOREIGN KEY ("reciever") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
