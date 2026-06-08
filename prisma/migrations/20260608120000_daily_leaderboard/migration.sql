-- CreateTable
CREATE TABLE "DailyResult" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT,
    "score" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "champion" BOOLEAN NOT NULL,
    "rosterHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyResult_date_score_idx" ON "DailyResult"("date", "score" DESC);
