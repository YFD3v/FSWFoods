import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import RestaurantItem from "./RestaurantItem";
import { authOptions } from "../_lib/auth";

const RestaurantsList = async () => {
  const restaurants = await db.restaurant.findMany({ take: 10 });
  const session = await getServerSession(authOptions);
  const userFavorites = await db.userFavoriteRestaurant.findMany({
    where: { userId: session?.user.id },
  });

  return (
    <div className="flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
      {restaurants.map((restaurant) => (
        <RestaurantItem
          userFavoriteRestaurants={userFavorites}
          userId={session?.user.id}
          key={restaurant.id}
          restaurant={restaurant}
        />
      ))}
    </div>
  );
};

export default RestaurantsList;
