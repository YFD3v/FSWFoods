"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Category, Prisma } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { updateRestaurantSettings } from "@/app/dashboard/_actions/actions";
import { useSession } from "next-auth/react";

interface RestaurantSettingsFormProps {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      categories: true;
    };
  }>;
  categories: Category[];
  defaultValues?: z.infer<typeof formSchema>;
}

const phoneRegex = new RegExp(
  /^(\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}[-\s]?\d{4})$/,
);

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  imageUrl: z.string().optional(),
  deliveryFee: z.string().optional(),
  deliveryTimeMinutes: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().regex(phoneRegex, "Invalid Number!").optional(),
  categories: z.string().optional(),
});

const RestaurantSettingsForm = ({
  restaurant,
  categories,
  defaultValues,
}: RestaurantSettingsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formatedCategories = data.categories?.split(",");

      const params = {
        id: data.id as string,
        name: data.name as string,
        imageUrl: data.imageUrl as string,
        deliveryFee: data.deliveryFee as string,
        deliveryTimeMinutes: data.deliveryTimeMinutes as string,
        website: data.website as string,
        address: data.address as string,
        phone: data.phone as string,
        ownerId: session?.user?.id as string,
        categories: formatedCategories,
      };
      await updateRestaurantSettings(params);
      form.reset({
        address: "",
        categories: "",
        deliveryFee: "",
        deliveryTimeMinutes: "",
        imageUrl: "",
        name: "",
        phone: "",
        website: "",
      });
      toast.success("Informações atualizadas com sucesso");
    } catch (error: any) {
      console.error(error);
      toast.error(`Houve um erro: ${error.message}`);
    }
    setIsLoading(false);
  };

  const categoriesPlaceholder = restaurant?.categories?.reduce(
    (accm, category) => {
      return accm + category.name + ", ";
    },
    "",
  );

  const allCategories = categories.reduce((accm, category) => {
    return accm + category.name + " | ";
  }, "");

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    required={false}
                    type="hidden"
                    {...field}
                    value={restaurant.id}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    required={false}
                    className="bg-transparent"
                    placeholder={restaurant.name}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Url*</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-transparent"
                    placeholder={restaurant.imageUrl}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Fee*</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-transparent"
                    placeholder={String(restaurant.deliveryFee)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryTimeMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Time Minutes*</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-transparent"
                    placeholder={String(restaurant.deliveryTimeMinutes)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-transparent"
                    placeholder={restaurant.website as string}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-transparent"
                    placeholder={restaurant.address ? restaurant.address : " "}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-transparent"
                    placeholder={restaurant.phone ? restaurant.phone : " "}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categorias disponíveis: {allCategories}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-transparent"
                    placeholder={categoriesPlaceholder}
                    {...field}
                    value={categoriesPlaceholder}
                  />
                </FormControl>
                <p className="text-xs font-light text-gray-500">
                  OBRIGATÓRIO SEPARAR POR VÍRGULAS
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Carregando" : "Atualizar"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default RestaurantSettingsForm;
