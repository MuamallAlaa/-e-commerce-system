-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phonenumber" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Protect" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "userid" TEXT NOT NULL,

    CONSTRAINT "Protect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "protectid" TEXT NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "disc" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orderitem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "protectid" TEXT NOT NULL,
    "orderid" TEXT NOT NULL,

    CONSTRAINT "Orderitem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryid" TEXT NOT NULL,

    CONSTRAINT "subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_protectid_key" ON "Discount"("protectid");

-- AddForeignKey
ALTER TABLE "Protect" ADD CONSTRAINT "Protect_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_protectid_fkey" FOREIGN KEY ("protectid") REFERENCES "Protect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orderitem" ADD CONSTRAINT "Orderitem_protectid_fkey" FOREIGN KEY ("protectid") REFERENCES "Protect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orderitem" ADD CONSTRAINT "Orderitem_orderid_fkey" FOREIGN KEY ("orderid") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
