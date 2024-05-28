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
import { useState } from "react";
import { LoginInputs } from "../_actions/handleSignIn";
import { signIn } from "next-auth/react";

interface LoginProps {
  defaultValues?: z.infer<typeof formSchema>;
}

const loginToDashboard = async ({ email, password }: LoginInputs) => {
  try {
    await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  } catch (error: any) {
    throw error;
  }
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This filed has to be filled." })
    .email("This is not a valid email."),
  password: z.string().min(6, { message: "This filed has to be filled." }),
});

const LoginForm = ({ defaultValues }: LoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await loginToDashboard({ email: data.email, password: data.password });
      toast.success("Logado(a) com sucesso, bem vindo(a) ao Dashboard!");
    } catch (error: any) {
      console.error(error);
      toast.error(`Houve um erro: ${error.message}`);
    }
    setIsLoading(false);
  };

  return (
    <TabsContent value="owner">
      <Card>
        <CardHeader>
          <CardTitle>Ir para Dashboard</CardTitle>
          <CardDescription>
            Faça login para o dashboard caso seja dono(a) de um restaurante!
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
              <div>
                <Button disabled={isLoading} type="submit">
                  {isLoading ? "Carregando" : "Entrar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default LoginForm;
