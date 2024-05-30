import styles from "@/app/_components/Dashboard/dashboard.module.css";
import Card from "../_components/Dashboard/card/card";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import CreateRestaurantForm from "../_components/Dashboard/CreateRestaurantForm";
import Image from "next/image";
import { BikeIcon, TimerIcon } from "lucide-react";
import { formatCurrency } from "../_helpers/price";
import Link from "next/link";
import { calculatedAvaliationRestaurant } from "../_actions/restaurant";
import { verifyIfUserOwnsRestaurant } from "./_actions/actions";
const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  const user = await db.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    include: {
      ownRestaurant: true,
    },
  });

  const categories = await db.category.findMany({});
  const restaurant = await db.restaurant.findFirst({
    where: {
      ownerId: session?.user.id,
    },
    include: {
      categories: true,
      products: {
        include: {
          category: true,
        },
      },
      usersWhoFavorited: true,
      rating: true,
      Order: true,
    },
  });
  if (!user || !session) return;

  const userOwnsRestaurant = await verifyIfUserOwnsRestaurant(
    session?.user.id as string,
  );

  const rating = await calculatedAvaliationRestaurant(restaurant?.id as string);

  const totalProductsCategories = restaurant?.products.map((product) => ({
    category: product.category.name,
    count: restaurant.products.filter((productCount) => {
      return productCount.category === product.category;
    }).length,
  }));
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        {!userOwnsRestaurant || !restaurant ? (
          <>
            <h2>Crie o seu restaurante</h2>
            <CreateRestaurantForm categories={categories} />
          </>
        ) : (
          <div className={styles.cards}>
            <Card
              name="Categories"
              categories={categories}
              totalProductsCategories={totalProductsCategories}
            />
            <Card name="Products" totalProducts={restaurant.products.length} />
            <Card name="Orders" totalOrders={restaurant.Order.length} />
            <div className="mt-5 flex w-full items-center justify-center gap-4">
              <div className="flex w-full flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-semibold">Restaurant INFO:</h2>
                <div>
                  <p>Rating: {isNaN(rating) ? "0.0" : rating} stars</p>
                  <p>
                    Users who favorited: {restaurant.usersWhoFavorited.length}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex w-full flex-col items-center justify-center gap-4">
                <h3>Preview of {restaurant?.name} for the customers:</h3>
                <div className="relative h-[136px] w-[272px]">
                  <Image
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    fill
                    sizes="100%"
                    className="rounded-lg object-cover shadow-md"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{restaurant.name}</h3>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                      <BikeIcon className="text-primary" size={14} />
                      <span className="text-xs text-muted-foreground">
                        {Number(restaurant.deliveryFee) === 0
                          ? "Entrega grátis"
                          : formatCurrency(Number(restaurant.deliveryFee))}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TimerIcon className="text-primary" size={14} />
                      <span className="text-xs text-muted-foreground">
                        {restaurant.deliveryTimeMinutes} min
                      </span>
                    </div>
                    <Link
                      target="_blank"
                      className="text-sm text-primary underline"
                      href={`/restaurants/${restaurant.id}`}
                    >
                      Visitar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
