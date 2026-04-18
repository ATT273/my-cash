-- AlterTable
ALTER TABLE "BudgetAllocation" ADD COLUMN     "isOverspent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "daily_envelope_balances" (
    "id" TEXT NOT NULL,
    "jarId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "daily_envelope_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "overspend_events" (
    "id" TEXT NOT NULL,
    "envelopeId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "overspend_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "daily_envelope_balances" ADD CONSTRAINT "daily_envelope_balances_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overspend_events" ADD CONSTRAINT "overspend_events_envelopeId_fkey" FOREIGN KEY ("envelopeId") REFERENCES "Jar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
