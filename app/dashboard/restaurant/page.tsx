import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import styles from "@/app/_components/Dashboard/settings/settings.module.css";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import RestaurantSettingsForm from "@/app/_components/Dashboard/restaurant/RestaurantSettingsForm";
import ButtonDeleteUserOrRestaurant from "@/app/_components/Dashboard/ButtonDeleteUserOrRestaurant";

const RestaurantSettingsPage = async () => {
  const session = await getServerSession(authOptions);
  const restaurant = await db.restaurant.findFirst({
    where: {
      ownerId: session?.user.id,
    },
    include: {
      categories: true,
    },
  });
  const categories = await db.category.findMany({});

  if (!restaurant) redirect("/dashboard");
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name as string}
            fill
          />
        </div>
        {restaurant.name}
      </div>
      <div className={styles.formContainer}>
        <RestaurantSettingsForm
          restaurant={restaurant}
          categories={categories}
        />
        <ButtonDeleteUserOrRestaurant id={restaurant.id} type="Restaurant" />
      </div>
    </div>
  );
};

export default RestaurantSettingsPage;
