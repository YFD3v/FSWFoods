import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import RestaurantImage from "./_components/RestaurantImage";
import RestaurantDetails from "./_components/RestaurantDetails";
import CartBanner from "./_components/CartBanner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

interface RestaurantPageProps {
  params: {
    id: string;
  };
}

const RestaurantPage = async ({ params: { id } }: RestaurantPageProps) => {
  const restaurant = await db.restaurant.findUnique({
    where: { id },
    include: {
      categories: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          Product: {
            where: {
              restaurantId: id,
            },
            include: {
              restaurant: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      products: {
        take: 10,
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  if (!restaurant) return notFound();
  const session = await getServerSession(authOptions);
  const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  return (
    <div>
      <RestaurantImage
        userFavoriteRestaurants={userFavoriteRestaurants}
        restaurant={restaurant}
      />
      <RestaurantDetails restaurant={restaurant} />
      <CartBanner restaurant={restaurant} />
    </div>
  );
};

export default RestaurantPage;
