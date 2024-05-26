"use client";
import { Rating } from "@mui/material";
import { Button } from "@/app/_components/ui/button";
import { SheetClose } from "@/app/_components/ui/sheet";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { avaliateRestaurant } from "@/app/_actions/restaurant";

interface AvaliatonMenuProps {
  restaurantId: string;
}

const AvaliationMenu = ({ restaurantId }: AvaliatonMenuProps) => {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number | null>(1);
  if (!session?.user) return redirect("/");

  const handleSubmit = async () => {
    try {
      if (!rating) return;
      await avaliateRestaurant({
        restaurantId,
        rating,
        userId: session.user.id as string,
      });
      toast.success("Restaurante avaliado com sucesso!");
    } catch (error) {
      toast.error(`Houve um erro: ${error}`);
      console.error(error);
    }
  };

  const handleChange = (rating: number | null) => {
    setRating(rating);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-5">
      <h3>Avalie o restaurante</h3>
      <Rating
        name="simple-controlled"
        value={rating}
        onChange={(_, value) => handleChange(value)}
      />
      <SheetClose>
        <Button onClick={handleSubmit}>Enviar</Button>
      </SheetClose>
    </div>
  );
};

export default AvaliationMenu;
