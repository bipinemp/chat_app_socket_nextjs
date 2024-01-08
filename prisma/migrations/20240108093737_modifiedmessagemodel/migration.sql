/*
  Warnings:

  - A unique constraint covering the columns `[senderId,receiverId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Message_senderId_receiverId_key" ON "Message"("senderId", "receiverId");
