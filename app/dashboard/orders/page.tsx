import Search from "@/app/_components/Dashboard/search/search";

import styles from "@/app/_components/Dashboard/orders/orders.module.css";
import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import Link from "next/link";
import Pagination from "@/app/_components/Dashboard/pagination/pagination";
import { verifyIfUserOwnsRestaurant } from "../_actions/actions";
import { redirect } from "next/navigation";

const OrdersPage = async () => {
  const session = await getServerSession(authOptions);

  const orders = await db.order.findMany({
    where: {
      restaurant: {
        ownerId: session?.user.id,
      },
    },
    include: {
      products: true,
      user: true,
    },
  });

  const totalOrders = await db.order.count({
    where: {
      restaurant: {
        ownerId: session?.user.id,
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
        <Search placeholder={"Search for a order..."} />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Products</td>
            <td>Delivery Fee</td>
            <td>Delivery Time</td>
            <td>Subtotal price</td>
            <td>Total Price</td>
            <td>Total Discounts</td>
            <td>Status</td>
            <td>Created At</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id}>
              <td>{order.user.name}</td>
              <td>{order.products.length}</td>
              <td>{String(order.deliveryFee)}</td>
              <td>{String(order.deliverTime)}</td>
              <td>{String(order.subTotalPrice)}</td>
              <td>{String(order.totalPrice)}</td>
              <td>{String(order.totalDiscounts)}</td>
              <td>{order.createdAt?.toString().slice(4, 16)}</td>
              <td>{order.status}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={totalOrders} />
    </div>
  );
};

export default OrdersPage;
