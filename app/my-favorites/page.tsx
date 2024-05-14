import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import { redirect } from "next/navigation";
import Header from "../_components/Header";
import RestaurantItem from "../_components/RestaurantItem";

const MyFavoritesRestaurants = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/");

  const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      restaurant: true,
    },
  });
  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes Favoritos</h2>
        <div className="flex w-full flex-col gap-6">
          {userFavoriteRestaurants.length > 0 ? (
            userFavoriteRestaurants.map(({ restaurant }) => (
              <RestaurantItem
                userFavoriteRestaurants={userFavoriteRestaurants}
                key={restaurant.id}
                restaurant={restaurant}
                className="min-w-full max-w-full"
              />
            ))
          ) : (
            <h3>Você ainda não favoritou nenhum restaurante.</h3>
          )}
        </div>
      </div>
    </>
  );
};

export default MyFavoritesRestaurants;
