-- DropForeignKey
ALTER TABLE "RoomMember" DROP CONSTRAINT "RoomMember_memberId_fkey";

-- AddForeignKey
ALTER TABLE "RoomMember" ADD CONSTRAINT "RoomMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
