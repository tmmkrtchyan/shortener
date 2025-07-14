-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "original_url" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "original_url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shorten_url" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_url_id" TEXT NOT NULL,

    CONSTRAINT "shorten_url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "original_url_url_key" ON "original_url"("url");

-- CreateIndex
CREATE UNIQUE INDEX "shorten_url_url_key" ON "shorten_url"("url");

-- CreateIndex
CREATE UNIQUE INDEX "shorten_url_user_id_url_key" ON "shorten_url"("user_id", "url");

-- AddForeignKey
ALTER TABLE "shorten_url" ADD CONSTRAINT "shorten_url_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shorten_url" ADD CONSTRAINT "shorten_url_original_url_id_fkey" FOREIGN KEY ("original_url_id") REFERENCES "original_url"("id") ON DELETE CASCADE ON UPDATE CASCADE;
