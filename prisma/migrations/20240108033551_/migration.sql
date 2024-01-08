-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "status" "FriendRequestStatus" NOT NULL DEFAULT 'PENDING';
