import DeliveryInfo from "@/app/_components/DeliveryInfo";
import ProductsList from "@/app/_components/ProductsList";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import { Prisma } from "@prisma/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import AvaliationMenu from "./AvaliationMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { calculatedAvaliationRestaurant } from "@/app/_actions/restaurant";

interface RestaurantDetailsProps {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      categories: {
        include: {
          Product: {
            include: {
              restaurant: {
                select: {
                  name: true;
                };
              };
            };
          };
        };
      };
      products: {
        include: {
          restaurant: {
            select: {
              name: true;
            };
          };
        };
      };
    };
  }>;
}

const RestaurantDetails = async ({ restaurant }: RestaurantDetailsProps) => {
  const session = await getServerSession(authOptions);
  const rating = await calculatedAvaliationRestaurant(restaurant.id);

  return (
    <div className="relative z-50 mt-[-1.5rem] rounded-tl-3xl rounded-tr-3xl bg-white py-5">
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-[0.375rem]">
          <div className="relative h-8 w-8">
            <Image
              fill
              sizes="100%"
              className="rounded-full object-cover"
              src={restaurant.imageUrl}
              alt={restaurant.name}
            />
          </div>
          <h1 className="text-xl font-semibold">{restaurant.name}</h1>
        </div>

        <div className="flex items-center gap-[3px] rounded-full bg-muted-foreground px-2 py-[2px] text-white ">
          <StarIcon size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold ">
            {isNaN(rating) ? "0.0" : rating}
          </span>
        </div>
        {session?.user.id && (
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="text-xs">
                Avaliar
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <AvaliationMenu restaurantId={restaurant.id} />
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className="px-5">
        <DeliveryInfo restaurant={restaurant} />
      </div>

      <div className="mt-3 flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
        {restaurant.categories.map((category) => (
          <div
            className="min-w-[167px] rounded-lg bg-[#F4f4f4] text-center"
            key={category.id}
          >
            <span className="text-xs text-muted-foreground">
              {category.name}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4 ">
        <h2 className="px-5 font-semibold">Mais pedidos</h2>
        <ProductsList products={restaurant.products} />
      </div>

      {restaurant.categories.map((category) => (
        <div key={category.id} className="mt-6 space-y-4 ">
          <h2 className="px-5 font-semibold">{category.name}</h2>
          <ProductsList products={category.Product} />
        </div>
      ))}
    </div>
  );
};

export default RestaurantDetails;
