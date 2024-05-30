"use client";
import { OrderStatus, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import styles from "./singleOrder.module.css";
import { updateOrder } from "@/app/dashboard/_actions/actions";
import Image from "next/image";
import { Button } from "@/app/_components/ui/button";

interface FormSingleOrderProps {
  order: Prisma.OrderGetPayload<{
    include: {
      products: {
        include: {
          product: {
            include: {
              category: true;
            };
          };
        };
      };
      user: true;
    };
  }>;
}

const FormSingleOrder = ({ order }: FormSingleOrderProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    try {
      await updateOrder(formData);
      formRef.current.reset();
      toast.success("Pedido atualizado com sucesso!");
      router.push("/dashboard/orders");
    } catch (error: any) {
      toast.error(
        `Houve um erro ao tentar atualizar o pedido: ${error.message}`,
      );
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
      <input type="hidden" value={order.id} name="id" />
      <label htmlFor="name">Who Orderd</label>
      <input
        disabled
        type="text"
        name="name"
        id="name"
        placeholder={order.user.name as string}
      />
      <label htmlFor="deliveryFee">Delivery Fee</label>
      <input
        disabled
        type="number"
        name="deliveryFee"
        id="deliveryFee"
        placeholder={String(order.deliveryFee)}
      />
      <label htmlFor="deliveryTime">Delivery Time</label>
      <input
        disabled
        type="number"
        name="deliveryTime"
        id="deliveryTime"
        placeholder={String(order.deliverTime)}
      />
      <label htmlFor="subTotalPrice">Subtotal Price</label>
      <input
        disabled
        type="text"
        name="subTotalPrice"
        id="subTotalPrice"
        placeholder={String(order.subTotalPrice)}
      />
      <label htmlFor="totalPrice">Total Price</label>
      <input
        disabled
        type="number"
        step={0.01}
        min={0.05}
        name="totalPrice"
        id="totalPrice"
        placeholder={`${String(order.subTotalPrice)}`}
      />

      <label htmlFor="totalDiscounts">Total Discounts</label>
      <input
        disabled
        type="number"
        step={0.01}
        min={0.05}
        name="totalDiscounts"
        id="totalDiscounts"
        placeholder={`${String(order.totalDiscounts)}`}
      />
      <label htmlFor="status">Status</label>
      <select name="status" id="status">
        <option
          selected={order.status === OrderStatus.CONFIRMED}
          value={OrderStatus.CONFIRMED}
        >
          {OrderStatus.CONFIRMED}
        </option>
        <option
          selected={order.status === OrderStatus.PREPARING}
          value={OrderStatus.PREPARING}
        >
          {OrderStatus.PREPARING}
        </option>
        <option
          selected={order.status === OrderStatus.DELIVERING}
          value={OrderStatus.DELIVERING}
        >
          {OrderStatus.DELIVERING}
        </option>
        <option
          selected={order.status === OrderStatus.COMPLETED}
          value={OrderStatus.COMPLETED}
        >
          {OrderStatus.COMPLETED}
        </option>
        <option
          selected={order.status === OrderStatus.CANCELED}
          value={OrderStatus.CANCELED}
        >
          {OrderStatus.CANCELED}
        </option>
      </select>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Quantity</td>
            <td>Price</td>
            <td>Discount %</td>
            <td>Category</td>
            <td>Created At</td>
          </tr>
        </thead>
        <tbody>
          {order.products?.map((reference) => (
            <tr key={reference.product.id}>
              <td>
                <div className={styles.product}>
                  <Image
                    src={reference.product.imageUrl}
                    width={80}
                    height={80}
                    alt={reference.product.name}
                    className={styles.productImage}
                  />
                </div>
                {reference.product.name}
              </td>
              <td>{reference.quantity}</td>
              <td>{String(reference.product.price)}</td>
              <td>{String(reference.product.discountPercentage)}</td>
              <td>{reference.product.category.name}</td>
              <td>{reference.product.createdAt?.toString().slice(4, 16)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button type="submit">Atualizar</Button>
    </form>
  );
};

export default FormSingleOrder;
