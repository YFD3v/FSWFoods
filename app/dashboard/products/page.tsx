import Image from "next/image";
import Link from "next/link";
import styles from "@/app/_components/Dashboard/products/products.module.css";
import { db } from "@/app/_lib/prisma";
import Pagination from "@/app/_components/Dashboard/pagination/pagination";
import { deleteProduct, verifyIfUserOwnsRestaurant } from "../_actions/actions";
import Search from "@/app/_components/Dashboard/search/search";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: { q: string; page: string };
}) => {
  const ITEMS_PER_PAGE = 2;
  const session = await getServerSession(authOptions);
  const q = searchParams?.q || "";
  const page = searchParams?.page || "1";

  const products = await db.product.findMany({
    include: { category: true },
    where: {
      restaurant: {
        ownerId: session?.user.id as string,
      },
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
    take: 2,
    skip: ITEMS_PER_PAGE * (parseInt(page) - 1),
    orderBy: {
      createdAt: "desc",
    },
  });
  const totalProducts = await db.product.count({
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
  });
  const userOwnsRestaurant = await verifyIfUserOwnsRestaurant(
    session?.user.id as string,
  );
  if (!userOwnsRestaurant) redirect("/dashboard");
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder={"Search for a post..."} />
        <Link href="/dashboard/products/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Description</td>
            <td>Img</td>
            <td>Price</td>
            <td>Discount %</td>
            <td>Category</td>
            <td>Created At</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id}>
              <td>
                <div className={styles.product}>
                  <Image
                    src={product.imageUrl}
                    width={80}
                    height={80}
                    alt={product.name}
                    className={styles.productImage}
                  />
                </div>
                {product.name}
              </td>
              <td>{product.description.slice(0, 25)}...</td>
              <td>{product.imageUrl.slice(0, 25)}</td>
              <td>{String(product.price)}</td>
              <td>{String(product.discountPercentage)}</td>
              <td>{product.category.name}</td>
              <td>{product.createdAt?.toString().slice(4, 16)}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/products/${product.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button className={`${styles.button} ${styles.delete}`}>
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={totalProducts} />
    </div>
  );
};

export default ProductsPage;
