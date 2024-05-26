"use client";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { TabsContent } from "@/app/_components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createOwnerRestaurant } from "../_actions/handleSignIn";
import { useState } from "react";

interface RegisterProps {
  defaultValues?: z.infer<typeof formSchema>;
}

const formSchema = z
  .object({
    name: z.string().min(3, {
      message: "Must be at least 3 characters.",
    }),
    email: z
      .string()
      .min(1, { message: "This filed has to be filled." })
      .email("This is not a valid email."),
    password: z.string().min(6, { message: "Must be at least 6 characters." }),
    confPassword: z
      .string()
      .min(6, { message: "Must be at least 6 characters." }),
  })
  .superRefine(({ confPassword, password }, ctx) => {
    if (confPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confPassword"],
      });
    }
  });

const RegisterForm = ({ defaultValues }: RegisterProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await createOwnerRestaurant({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      form.reset({ name: "", confPassword: "", email: "", password: "" });
      toast.success(
        "Registro realizado com sucesso, agora você pode fazer login!",
      );
      setIsLoading(false);
    } catch (error: any) {
      toast.error(`Houve um erro: ${error.message}`);
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="register">
      <Card>
        <CardHeader>
          <CardTitle>Registrar</CardTitle>
          <CardDescription>
            Registre-se para criar seu próprio restaurante!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
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
                      <Input type="text" {...field} />
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
                      <Input type="email" {...field} />
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
                      <Input type="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Button disabled={isLoading} type="submit">
                  {isLoading ? "Carregando" : "Registrar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default RegisterForm;
