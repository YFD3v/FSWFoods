import styles from "@/app/_components/Dashboard/orders/singleOrder/singleOrder.module.css";
import { redirect } from "next/navigation";
import Image from "next/image";
import { db } from "@/app/_lib/prisma";

import FormSingleOrder from "@/app/_components/Dashboard/orders/singleOrder/FormSingleOrder";

const SingleOrderPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const order = await db.order.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
      user: true,
    },
  });
  if (!order) return redirect("/dashboard/orders");

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image
            src={order.user.image ?? "/noavatar.png"}
            alt={order.user.name as string}
            fill
          />
        </div>
        {order.user.name}
      </div>
      <div className={styles.formContainer}>
        <FormSingleOrder order={order} />
      </div>
    </div>
  );
};

export default SingleOrderPage;
