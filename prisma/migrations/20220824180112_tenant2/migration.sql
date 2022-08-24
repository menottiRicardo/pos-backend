-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "Price" REAL NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductsOrdered" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "remaing" INTEGER NOT NULL,
    "orderId" TEXT,
    "tenantId" TEXT NOT NULL,
    CONSTRAINT "ProductsOrdered_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
