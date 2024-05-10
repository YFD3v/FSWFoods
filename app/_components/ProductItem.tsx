import { Prisma } from "@prisma/client";
import Image from "next/image";
import { calculateProductTotalPrice, formatCurrency } from "../_helpers/price";
import Link from "next/link";
import DiscountBadge from "./DiscountBadge";
import { cn } from "../_lib/utils";

interface ProductItemProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
        };
      };
    };
  }>;
  className?: string;
}

const ProductIem = ({ product, className }: ProductItemProps) => {
  return (
    <Link
      className={cn("min-w-[150px] max-w-[150px]", className)}
      href={`/products/${product.id}`}
    >
      <div className="w-full space-y-2 ">
        <div className="relative aspect-square w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="rounded-lg object-cover shadow-md"
          />
          {product.discountPercentage && (
            <div className="absolute left-2 top-2">
              <DiscountBadge discountPercentage={product.discountPercentage} />
            </div>
          )}
        </div>
        <div>
          <h2 className="truncate text-sm">{product.name}</h2>
          <div className="flex items-center gap-1">
            <h3 className="font-semibold">
              {formatCurrency(calculateProductTotalPrice(product))}
            </h3>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(Number(product.price))}
              </span>
            )}
          </div>
          <span className="text-muted-foregound block text-xs">
            {product.restaurant.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductIem;
