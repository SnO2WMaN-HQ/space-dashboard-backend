-- CreateTable
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "minutesUrl" TEXT,
    "openDate" DATE NOT NULL,
    "openTime" TIME,
    "hostUserId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Following" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comment" TEXT,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "twitterId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "uniqueName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "picture" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Following.spaceId_userId_unique" ON "Following"("spaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account.twitterId_unique" ON "Account"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "User.uniqueName_unique" ON "User"("uniqueName");

-- CreateIndex
CREATE UNIQUE INDEX "User_accountId_unique" ON "User"("accountId");

-- AddForeignKey
ALTER TABLE "Space" ADD FOREIGN KEY ("hostUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
