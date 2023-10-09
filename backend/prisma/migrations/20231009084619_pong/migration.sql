/*
  Warnings:

  - A unique constraint covering the columns `[roomName]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_roomName_key" ON "ChatRoom"("roomName");
