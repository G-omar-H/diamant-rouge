/*
  Warnings:

  - You are about to drop the column `date` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `appointmentDate` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointmentTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointmentType` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointmentTypeLabel` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientEmail` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationType` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "appointmentDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "appointmentTime" TEXT NOT NULL,
ADD COLUMN     "appointmentType" TEXT NOT NULL,
ADD COLUMN     "appointmentTypeLabel" TEXT NOT NULL,
ADD COLUMN     "clientEmail" TEXT NOT NULL,
ADD COLUMN     "clientPhone" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" TEXT NOT NULL DEFAULT '60',
ADD COLUMN     "guestCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "locationType" TEXT NOT NULL,
ADD COLUMN     "preferences" TEXT,
ADD COLUMN     "specialRequests" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
