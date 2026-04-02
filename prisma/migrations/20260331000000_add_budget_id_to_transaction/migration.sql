-- AlterTable: Add budgetId to Transaction
ALTER TABLE "Transaction" ADD COLUMN "budgetId" TEXT;

-- Backfill via jarId (expense transactions with a jar)
UPDATE "Transaction" t
SET "budgetId" = j."budgetId"
FROM "Jar" j
WHERE t."jarId" = j.id AND t."budgetId" IS NULL;

-- Backfill remaining via walletId + date range (income transactions)
UPDATE "Transaction" t
SET "budgetId" = b.id
FROM "Budget" b
WHERE t."walletId" = b."walletId"
  AND t."budgetId" IS NULL
  AND t."date" >= b."startedAt"
  AND (b."endedAt" IS NULL OR t."date" <= b."endedAt");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE SET NULL ON UPDATE CASCADE;
