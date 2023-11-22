/*
  Warnings:

  - A unique constraint covering the columns `[senderId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Message_senderId_key" ON "Message"("senderId");
