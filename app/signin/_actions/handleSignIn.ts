"use server";

import { db } from "@/app/_lib/prisma";
import bcrypt from "bcrypt";

interface RegisterInputs {
  name: string;
  email: string;
  password: string;
}

export interface LoginInputs {
  email: string;
  password: string;
}

export const createOwnerRestaurant = async ({
  name,
  email,
  password,
}: RegisterInputs) => {
  const userAlreadyExist = await db.user.findUnique({ where: { email } });
  if (userAlreadyExist) throw new Error("User already exist, please login!");
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "OWNER",
      },
    });
    return;
  } catch (error) {
    return error;
  }
};

export const authenticate = async ({ email, password }: LoginInputs) => {
  const user = await db.user.findFirst({ where: { email } });
  if (!user || user.role !== "OWNER")
    throw new Error("User don't exist, please register!");
  try {
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password as string,
    );
    if (!isPasswordCorrect) throw new Error("Wrong credentials!");
    return user;
  } catch (error) {
    console.error(`Erro at authenticating: ${error}`);
    throw new Error("Failed to login!");
  }
};
