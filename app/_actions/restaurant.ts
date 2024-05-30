"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";

interface AvaliateRestaurantProps {
  userId: string;
  restaurantId: string;
  rating: number;
}

export const toggleFavoriteRestaurant = async (
  userId: string,
  restaurantId: string,
) => {
  const isFavorite = await db.userFavoriteRestaurant.findFirst({
    where: {
      userId,
      restaurantId,
    },
  });

  if (isFavorite) {
    await db.userFavoriteRestaurant.delete({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId,
        },
      },
    });

    revalidatePath("/");
    return;
  }

  await db.userFavoriteRestaurant.create({
    data: {
      userId,
      restaurantId,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
};

export const avaliateRestaurant = async ({
  restaurantId,
  userId,
  rating,
}: AvaliateRestaurantProps) => {
  const avaliationAlreadyExists = await db.restaurantRating.findFirst({
    where: { userId, restaurantId },
  });
  if (avaliationAlreadyExists)
    return updateAvaliationRestaurant({ userId, rating, restaurantId });
  try {
    const avaliaton = await db.restaurantRating.create({
      data: {
        rating,
        userId,
        restaurantId,
      },
    });
    revalidatePath("/restaurants/" + restaurantId);
    revalidatePath("/dashboard");
    revalidatePath("/");
    return avaliaton;
  } catch (error) {
    return error;
  }
};

export const updateAvaliationRestaurant = async ({
  userId,
  restaurantId,
  rating,
}: AvaliateRestaurantProps) => {
  try {
    const updatedAvaliation = await db.restaurantRating.updateMany({
      where: {
        userId,
        restaurantId,
      },
      data: {
        rating,
      },
    });
    revalidatePath("/restaurants/" + restaurantId);
    revalidatePath("/dashboard");
    revalidatePath("/");
    return updatedAvaliation;
  } catch (error) {
    return error;
  }
};

export const calculatedAvaliationRestaurant = async (restaurantId: string) => {
  const allRatings = await db.restaurantRating.findMany({
    where: { restaurantId },
  });

  const sum = allRatings.reduce((acc, rating) => acc + rating.rating, 0);
  const average = sum / allRatings.length;
  const weightedAverage = Math.round(average * 2) / 2;
  return weightedAverage;
};
