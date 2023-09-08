-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "picture" TEXT,
    "picture_status" BOOLEAN NOT NULL DEFAULT false,
    "picture_mimetype" TEXT,
    "username" TEXT NOT NULL,
    "displayname" TEXT NOT NULL,
    "wins" INTEGER NOT NULL,
    "loses" INTEGER NOT NULL,
    "elo" INTEGER NOT NULL,
    "status_2fa" BOOLEAN NOT NULL DEFAULT false,
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "secret_2fa" TEXT,
    "secret_authutl" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "win" BOOLEAN NOT NULL,
    "lose" BOOLEAN NOT NULL,
    "againstId" INTEGER NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_displayname_key" ON "users"("displayname");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_againstId_fkey" FOREIGN KEY ("againstId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
