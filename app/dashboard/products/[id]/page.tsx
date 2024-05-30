import styles from "@/app/_components/Dashboard/products/singleProduct/singleProduct.module.css";
import { redirect } from "next/navigation";
import Image from "next/image";
import { db } from "@/app/_lib/prisma";
import FormSingleProduct from "@/app/_components/Dashboard/products/singleProduct/FormSingleProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

const SingleProductPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
  const session = await getServerSession(authOptions);
  const restaurant = await db.restaurant.findFirst({
    where: {
      ownerId: session?.user.id,
    },
    include: {
      categories: true,
    },
  });

  if (!product || !restaurant) return redirect("/dashboard/products");
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image
            src={product.imageUrl ?? "/noavatar.png"}
            alt={product.name}
            fill
          />
        </div>
        {product.name}
      </div>
      <div className={styles.formContainer}>
        <FormSingleProduct
          categories={restaurant.categories}
          product={product}
        />
      </div>
    </div>
  );
};

export default SingleProductPage;
