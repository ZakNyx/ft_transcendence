/*
  Warnings:

  - Made the column `dmId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_dmId_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "dmId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_dmId_fkey" FOREIGN KEY ("dmId") REFERENCES "DM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
