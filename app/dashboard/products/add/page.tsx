import { db } from "@/app/_lib/prisma";
import styles from "@/app/_components/Dashboard/products/addProduct/addProduct.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import FormAddProduct from "@/app/_components/Dashboard/products/addProduct/FormAddProduct";

const AddProductsPage = async () => {
  const session = await getServerSession(authOptions);
  const restaurant = await db.restaurant.findFirst({
    where: {
      ownerId: session?.user.id,
    },
    include: {
      categories: true,
    },
  });
  if (!restaurant) return;
  return (
    <div className={styles.container}>
      <FormAddProduct
        categories={restaurant.categories}
        ownerId={session?.user.id as string}
      />
    </div>
  );
};

export default AddProductsPage;
