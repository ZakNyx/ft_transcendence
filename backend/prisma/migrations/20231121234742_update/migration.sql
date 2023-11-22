/*
  Warnings:

  - You are about to drop the `_blocked` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_friendreq` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_blocked" DROP CONSTRAINT "_blocked_A_fkey";

-- DropForeignKey
ALTER TABLE "_blocked" DROP CONSTRAINT "_blocked_B_fkey";

-- DropForeignKey
ALTER TABLE "_friendreq" DROP CONSTRAINT "_friendreq_A_fkey";

-- DropForeignKey
ALTER TABLE "_friendreq" DROP CONSTRAINT "_friendreq_B_fkey";

-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_B_fkey";

-- DropTable
DROP TABLE "_blocked";

-- DropTable
DROP TABLE "_friendreq";

-- DropTable
DROP TABLE "_friends";
