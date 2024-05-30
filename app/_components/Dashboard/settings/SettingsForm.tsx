"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { updateUser } from "@/app/dashboard/_actions/actions";
import { useSession } from "next-auth/react";
interface SettingsProps {
  defaultValues?: z.infer<typeof formSchema>;
  placeholders: string[];
}

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Must be at least 3 characters.",
    })
    .optional(),
  email: z.string().email("This is not a valid email.").optional(),
  password: z
    .string()
    .min(6, { message: "This filed has to be filled." })
    .optional(),
});

const SettingsForm = ({ defaultValues, placeholders }: SettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { data: session } = useSession();

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const isAllFieldsEmpty =
      data.email === undefined &&
      data.name === undefined &&
      data.password === undefined;
    if (isAllFieldsEmpty) return toast.error("Preencha todos os campos");
    setIsLoading(true);
    try {
      const params = {
        name: data.name,
        email: data.email,
        password: data.password,
        id: session?.user.id as string,
      };

      await updateUser(params);
      form.reset({ name: "", email: "", password: "" });
      toast.success("Dados atualizados com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(`Houve um erro: ${error.message}`);
    }
    setIsLoading(false);
  };

  return (
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder={placeholders[0]}
                  className="bg-transparent"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder={placeholders[1]}
                  className="bg-transparent"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input className="bg-transparent" type="Password" {...field} />
              </FormControl>
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
  );
};

export default SettingsForm;
