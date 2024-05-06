import { db } from "../_lib/prisma";
import ProductIem from "./ProductItem";

const ProductsList = async () => {
  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 10,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
      {products.map((product) => (
        <ProductIem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;