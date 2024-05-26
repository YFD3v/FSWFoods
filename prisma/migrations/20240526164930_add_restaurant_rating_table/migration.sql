-- CreateTable
CREATE TABLE "RestaurantRating" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RestaurantRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantRating" ADD CONSTRAINT "RestaurantRating_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantRating" ADD CONSTRAINT "RestaurantRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
