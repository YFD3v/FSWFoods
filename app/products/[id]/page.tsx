import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import ProductImage from "./_components/ProductImage";
import ProductDetails from "./_components/ProductDetails";

interface ProductPageProps {
  //Resgatando o id da rota
  params: {
    id: string;
  };
}
const ProductPage = async ({ params: { id } }: ProductPageProps) => {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      restaurant: true,
    },
  });

  const juices = await db.product.findMany({
    where: {
      category: {
        name: "Sucos",
      },
      restaurant: {
        id: product?.restaurant.id,
      },
    },
    include: {
      restaurant: true,
    },
  });

  if (!product) return notFound();

  return (
    <div>
      <ProductImage product={product} />
      <ProductDetails complementaryProducts={juices} product={product} />
    </div>
  );
};

export default ProductPage;
