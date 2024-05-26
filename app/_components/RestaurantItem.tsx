"use client";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { BikeIcon, HeartIcon, StarIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "../_lib/utils";
import {
  calculatedAvaliationRestaurant,
  toggleFavoriteRestaurant,
} from "../_actions/restaurant";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface RestaurantItemProps {
  restaurant: Restaurant;
  className?: string;
  userFavoriteRestaurants: UserFavoriteRestaurant[];
}

const RestaurantItem = ({
  restaurant,
  className,
  userFavoriteRestaurants,
}: RestaurantItemProps) => {
  const [rating, setRating] = useState<number>();
  const { data: session } = useSession();

  const isFavorited = userFavoriteRestaurants.some(
    (fav) => fav.restaurantId === restaurant.id,
  );

  const handleFavoriteClick = async () => {
    if (!session?.user.id) return;
    try {
      await toggleFavoriteRestaurant(session?.user.id, restaurant.id);
      toast.success(
        isFavorited
          ? "Restaurante removido dos favoritos!"
          : "Restaurante favoritado com sucesso!",
      );
    } catch (error) {
      toast.error("Erro ao favoritar restaurante");
    }
  };

  useEffect(() => {
    const fetchCalculatedRating = async () => {
      const calculatedRating = await calculatedAvaliationRestaurant(
        restaurant.id,
      );
      setRating(calculatedRating);
    };
    fetchCalculatedRating();
  }, []);

  return (
    <div className={cn("min-w-[266px] max-w-[266px]", className)}>
      <div className="w-full space-y-3">
        <div className="relative h-[136px] w-full">
          <Link className="" href={`/restaurants/${restaurant.id}`}>
            <div className="relative h-[136px] w-full">
              <Image
                src={restaurant.imageUrl}
                alt={restaurant.name}
                fill
                sizes="100%"
                className="rounded-lg object-cover shadow-md"
              />
            </div>
          </Link>
          <div className="absolute left-2 top-2 flex items-center gap-[2px] rounded-full bg-white px-2 py-[2px] ">
            <StarIcon size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold ">
              {isNaN(rating as number) ? "0.0" : rating}
            </span>
          </div>
          {session?.user.id && (
            <Button
              size="icon"
              className={`absolute right-2 top-2 h-7 w-7 rounded-full bg-gray-700 ${isFavorited && "bg-primary hover:bg-gray-700"}`}
              onClick={handleFavoriteClick}
            >
              <HeartIcon size={16} className="fill-white" />
            </Button>
          )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantItem;
