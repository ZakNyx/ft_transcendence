-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "roomName" TEXT NOT NULL,
    "timeCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admins" TEXT[],
    "mutedUsers" TEXT[],
    "bannedUsers" TEXT[],
    "isDm" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'public',
    "password" TEXT,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_userInChatRoom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_roomName_key" ON "ChatRoom"("roomName");

-- CreateIndex
CREATE UNIQUE INDEX "_userInChatRoom_AB_unique" ON "_userInChatRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_userInChatRoom_B_index" ON "_userInChatRoom"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "MessageRoomData" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userInChatRoom" ADD CONSTRAINT "_userInChatRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userInChatRoom" ADD CONSTRAINT "_userInChatRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
