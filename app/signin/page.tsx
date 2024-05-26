import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../_components/ui/tabs";
import GoogleButton from "./_components/GoogleButton";
import LoginForm from "./_components/LoginForm";
import RegisterForm from "./_components/RegisterForm";

const SignInPage = () => {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center bg-[#121212]">
      <Tabs defaultValue="customer" className="w-[600px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="owner">Owner</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
              <CardDescription>
                Faça login para poder fazer o seu pedido!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <GoogleButton />
            </CardContent>
          </Card>
        </TabsContent>
        <LoginForm />
        <RegisterForm />
      </Tabs>
    </div>
  );
};

export default SignInPage;
