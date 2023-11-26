/*
  Warnings:

  - You are about to drop the `ChatRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userInChatRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "MessageRoomData";

-- DropForeignKey
ALTER TABLE "_userInChatRoom" DROP CONSTRAINT "_userInChatRoom_A_fkey";

-- DropForeignKey
ALTER TABLE "_userInChatRoom" DROP CONSTRAINT "_userInChatRoom_B_fkey";

-- DropTable
DROP TABLE "ChatRoom";

-- DropTable
DROP TABLE "_userInChatRoom";
