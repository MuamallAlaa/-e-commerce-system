-- CreateTable
CREATE TABLE "Inbox" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InboxToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InboxToUser_AB_unique" ON "_InboxToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_InboxToUser_B_index" ON "_InboxToUser"("B");

-- AddForeignKey
ALTER TABLE "_InboxToUser" ADD CONSTRAINT "_InboxToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Inbox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InboxToUser" ADD CONSTRAINT "_InboxToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
