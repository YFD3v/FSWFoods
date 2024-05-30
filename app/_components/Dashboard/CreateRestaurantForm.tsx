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
import { Category } from "@prisma/client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import ProductsInputsForm from "./ProductsInputForm";
import { createRestaurant } from "@/app/dashboard/_actions/actions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
interface CreateRestaurantFormProps {
  defaultValues?: z.infer<typeof formSchema>;
  categories: Category[];
}

export interface ProductsInputs {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  discountPercentage: number;
  category: string;
}

const phoneRegex = new RegExp(
  /^(\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}[-\s]?\d{4})$/,
);

const formSchema = z.object({
  name: z.string().min(3, { message: "This field has to be filled." }),
  imageUrl: z.string().min(6, { message: "This field has to be filled." }),
  deliveryFee: z.string().min(1, { message: "This field has to be filled." }),
  deliveryTimeMinutes: z
    .string()
    .min(1, { message: "This field has to be filled." }),
  website: z.string(),
  address: z.string(),
  phone: z.string().regex(phoneRegex, "Invalid Number!"),
  categories: z.string().min(1, { message: "This field has to be filled" }),
});

const CreateRestaurantForm = ({
  defaultValues,
  categories,
}: CreateRestaurantFormProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductsInputs[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const allCategories = categories.reduce((accm, category) => {
    return accm + category.name + " | ";
  }, "");

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formatedCategories = data.categories.split(",");
      const params = {
        name: data.name,
        imageUrl: data.imageUrl,
        deliveryFee: data.deliveryFee,
        deliveryTimeMinutes: data.deliveryTimeMinutes,
        website: data.website,
        address: data.address,
        phone: data.phone,
        products,
        categories: formatedCategories,
        ownerId: session?.user.id,
      };
      await createRestaurant(params);

      toast.success("Restaurante criado com sucesso, boas vendas!");
      form.reset();
    } catch (error: any) {
      console.error(error);
      toast.error(`Houve um erro ao criar: ${error.message}`);
    }
    setIsLoading(false);
  };

  return (
    <div>
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
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-transparent"
                    placeholder={"Burguer Queen"}
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
                    placeholder="https://link.com"
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
                <FormLabel>Delivery Fee* CASO GRÁTIS DIGITE 0</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-transparent"
                    placeholder={"20"}
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
                    placeholder={"40"}
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
                    placeholder={"www.seusite.com"}
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
                    placeholder={
                      "Rua fulano ciclano, Liberdade, SÃO PAULO - SP"
                    }
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
                    placeholder={"+55 (11) 91234-5678"}
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
                    {...field}
                    placeholder="Sobremesas, Sucos,"
                  />
                </FormControl>
                <p className="text-sm font-light text-gray-500">
                  OBRIGATÓRIO SEPARAR POR VÍRGULAS
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <ProductsInputsForm products={products} setProducts={setProducts} />
          </div>

          <Button disabled={isLoading} type="submit">
            {isLoading ? "Carregando" : "Criar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateRestaurantForm;
