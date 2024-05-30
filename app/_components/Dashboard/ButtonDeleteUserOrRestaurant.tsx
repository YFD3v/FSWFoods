"use client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { deleteUserOrRestaurant } from "@/app/dashboard/_actions/actions";

interface ButtonDeleteUserOrRestaurantProps {
  id: string;
  type: "User" | "Restaurant";
}

const ButtonDeleteUserOrRestaurant = ({
  id,
  type,
}: ButtonDeleteUserOrRestaurantProps) => {
  const handleClick = async () => {
    try {
      await deleteUserOrRestaurant(id, type);
    } catch (error: any) {
      console.error(error);
      toast.error(
        `Houve um erro ao tentar excluir o ${type}: ${error.message}`,
      );
    }
  };
  return (
    <div className="mt-5">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-transparent" variant={"outline"}>
            Delete {type}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your:{" "}
              {type} and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClick}>DELETE</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ButtonDeleteUserOrRestaurant;
