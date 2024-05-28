"use client";

import { Button } from "@/app/_components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

const GoogleButton = () => {
  const loginCustomer = async () => {
    await signIn("google", { callbackUrl: "/" });
  };
  return (
    <div>
      <Button
        variant="ghost"
        className="flex h-full w-full items-center justify-center gap-2 border-2 text-lg"
        onClick={() => loginCustomer()}
      >
        <Image
          src="/google-icon.png"
          alt="Google icon"
          width={30}
          height={30}
        />
        Faça login com Google
      </Button>
    </div>
  );
};

export default GoogleButton;
