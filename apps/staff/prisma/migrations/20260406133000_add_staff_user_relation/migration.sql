ALTER TABLE "staff"
ADD COLUMN "userId" TEXT;

CREATE UNIQUE INDEX "staff_userId_key" ON "staff"("userId");

ALTER TABLE "staff"
ADD CONSTRAINT "staff_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
