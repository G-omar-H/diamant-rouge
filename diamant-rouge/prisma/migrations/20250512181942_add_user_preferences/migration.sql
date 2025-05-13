-- AlterTable
ALTER TABLE "User" ADD COLUMN     "braceletSize" TEXT,
ADD COLUMN     "memberStatus" TEXT NOT NULL DEFAULT 'regular',
ADD COLUMN     "necklaceLength" TEXT,
ADD COLUMN     "preferredGemstones" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "preferredMetals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "ringSize" TEXT;
