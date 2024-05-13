import { useContext, useState } from "react";
import { CartContext } from "../_contexts/cart";
import CartItem from "./CartItem";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { createOrder } from "../_actions/order";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CartProps {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (IsOpen: boolean) => void;
}

const Cart = ({ setIsOpen }: CartProps) => {
  const router = useRouter();

  const [isSubmitingLoading, setIsSubmitingLoading] = useState(false);
  const [isConfirmeDialogOpen, setIsConfirmeDialogOpen] = useState(false);
  const { products, subTotalPrice, totalDiscount, totalPrice, clearCart } =
    useContext(CartContext);

  const { data: session } = useSession();
  const handleFinishOrderClick = async () => {
    if (!session?.user) return;
    const restaurant = products[0].restaurant;
    try {
      setIsSubmitingLoading(true);
      await createOrder({
        subTotalPrice,
        totalDiscounts: totalDiscount,
        totalPrice,
        deliveryFee: restaurant.deliveryFee,
        deliverTime: restaurant.deliveryTimeMinutes,
        restaurant: {
          connect: { id: restaurant.id },
        },
        status: OrderStatus.CONFIRMED,
        user: {
          connect: { id: session?.user.id },
        },
        products: {
          createMany: {
            data: products.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });
      clearCart();
      setIsOpen(false);
      toast("Pedido realizado com sucesso", {
        description: "Veja em seus pedidos",
        action: {
          label: "Meus pedidos",
          onClick: () => router.push("/my-orders"),
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitingLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col py-5">
        {products.length > 0 ? (
          <>
            <div className="flex-auto space-y-4">
              {products.map((product) => (
                <CartItem key={product.id} cartProduct={product} />
              ))}
            </div>
            <div className="mt-6">
              <Card>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subTotalPrice)}</span>
                  </div>

                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Descontos</span>
                    <span>{formatCurrency(totalDiscount)}</span>
                  </div>

                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Entrega</span>
                    {Number(products?.[0].restaurant.deliveryFee) === 0 ? (
                      <span className="uppercase text-primary">Grátis</span>
                    ) : (
                      formatCurrency(
                        Number(products?.[0].restaurant.deliveryFee),
                      )
                    )}
                  </div>

                  <Separator />
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button
              disabled={isSubmitingLoading}
              onClick={() => setIsConfirmeDialogOpen(true)}
              className="mt-6 w-full"
            >
              Finalizar pedido
            </Button>
          </>
        ) : (
          <h2 className="text-center font-medium">Sua sacola está vazia.</h2>
        )}
      </div>

      <AlertDialog
        open={isConfirmeDialogOpen}
        onOpenChange={setIsConfirmeDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja finalizar seu pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao finalizar seu pedido, você concorda com os termos e condições
              da noss plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinishOrderClick}
              disabled={isSubmitingLoading}
            >
              {isSubmitingLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Cart;
