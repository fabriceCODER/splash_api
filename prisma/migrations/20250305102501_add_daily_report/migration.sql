/*
  Warnings:

  - You are about to drop the column `numChannels` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `stations` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `DailyReport` table. All the data in the column will be lost.
  - Added the required column `stationCount` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DailyReport" DROP CONSTRAINT "DailyReport_adminId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "numChannels";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "stations",
ADD COLUMN     "solveTime" DOUBLE PRECISION,
ADD COLUMN     "stationCount" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'unsolved',
ADD COLUMN     "waterLost" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "DailyReport" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
