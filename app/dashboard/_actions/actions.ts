"use server";

import { ProductsInputs } from "@/app/_components/Dashboard/CreateRestaurantForm";
import { db } from "@/app/_lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

interface RestaurantInputs {
  id?: string;
  name: string;
  imageUrl: string;
  deliveryFee: string;
  deliveryTimeMinutes: string;
  website?: string;
  address?: string;
  phone?: string;
  products?: ProductsInputs[];
  ownerId?: string;
  categories: string[] | string | undefined;
}

interface SettingsInputs {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  id: string;
}

export const updateRestaurantSettings = async ({
  categories,
  deliveryFee,
  deliveryTimeMinutes,
  imageUrl,
  name,
  address,
  phone,
  website,
  id,
  ownerId,
}: RestaurantInputs) => {
  try {
    let categoriesId: string[] = [];

    if (Array.isArray(categories)) {
      for (const category of categories) {
        const categoryFetched = await findCategoryByName(category.trim());
        if (categoryFetched) {
          categoriesId.push(categoryFetched.id);
        } else {
          throw new Error(`Categoria não encontrada: ${category}`);
        }
      }
    } else {
      const categoryFetched = await findCategoryByName(categories as string);
      if (categoryFetched) {
        categoriesId.push(categoryFetched.id);
      } else {
        throw new Error(`Categoria não encontrada: ${categories}`);
      }
    }

    const updateFields: any = {
      id,
      name,
      imageUrl,
      deliveryFee,
      deliveryTimeMinutes:
        deliveryTimeMinutes === undefined
          ? deliveryTimeMinutes
          : Number(deliveryTimeMinutes),
      website,
      address,
      phone,
    };
    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || updateFields[key] === undefined) &&
        delete updateFields[key],
    );

    const updatedRestaurant = await db.restaurant.update({
      where: { id, ownerId },
      data: {
        ...updateFields,
        categories: {
          connect: categoriesId.map((id) => {
            return { id };
          }),
        },
      },
    });
    revalidatePath("/dashboard/restaurant");
    return updatedRestaurant;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

export const createRestaurant = async ({
  website,
  deliveryFee,
  deliveryTimeMinutes,
  imageUrl,
  name,
  address,
  phone,
  products,
  categories,
  ownerId,
}: RestaurantInputs) => {
  //Talvez fazer uma verificação com ownerId para ver se ja tem um restaurante.
  try {
    if (!products) return;

    let categoriesProductsId: string[] = [];

    for (const product of products) {
      const categoryFetched = await findCategoryByName(product.category);
      if (categoryFetched) {
        categoriesProductsId.push(categoryFetched.id);
      } else {
        throw new Error(
          `Categoria não encontrada para o produto: ${product.category}`,
        );
      }
    }

    let categoriesId: string[] = [];

    if (Array.isArray(categories)) {
      for (const category of categories) {
        const categoryFetched = await findCategoryByName(category.trim());
        if (categoryFetched) {
          categoriesId.push(categoryFetched.id);
        } else {
          throw new Error(`Categoria não encontrada: ${category}`);
        }
      }
    } else {
      const categoryFetched = await findCategoryByName(categories as string);
      if (categoryFetched) {
        categoriesId.push(categoryFetched.id);
      } else {
        throw new Error(`Categoria não encontrada: ${categories}`);
      }
    }
    const newRestaurant = await db.restaurant.create({
      data: {
        website,
        deliveryFee,
        deliveryTimeMinutes: Number(deliveryTimeMinutes),
        imageUrl,
        name,
        phone,
        address,
        owner: {
          connect: { id: ownerId },
        },
        ownerId,
        products: {
          create: products.map((product, index) => ({
            name: product.name,
            price: product.price,
            description: product.description,
            category: {
              connect: {
                name: product.category,
                id: categoriesProductsId[index],
              },
            },
            imageUrl: product.imageUrl,
            discountPercentage: Number(product.discountPercentage),
          })),
        },
        categories: {
          connect: categoriesId.map((id) => {
            return { id };
          }),
        },
      },
    });
    await db.user.update({
      where: { id: ownerId },
      data: {
        restaurantId: newRestaurant.id,
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/restaurant");
    return newRestaurant;
  } catch (error: any) {
    throw error;
  }
};

export const deleteUserOrRestaurant = async (id: string, type: string) => {
  try {
    if (type === "Restaurant") {
      await db.restaurant.delete({ where: { id } });
    } else {
      await db.user.delete({ where: { id } });
    }
    revalidatePath("/dashboard");
    revalidatePath("/");
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

export const deleteProduct = async (formData: FormData) => {
  const { id } = Object.fromEntries(formData);
  try {
    await db.product.delete({ where: { id: id as string } });
    revalidatePath("/dashboard/products");
  } catch (error: any) {
    throw new Error(` ${error.message}`);
  }
};

export const createProduct = async (formData: FormData) => {
  const {
    name,
    imageUrl,
    price,
    discountPercentage,
    category,
    description,
    ownerId,
  } = Object.fromEntries(formData);

  if (
    !name ||
    !imageUrl ||
    !price ||
    !discountPercentage ||
    !category ||
    !description
  )
    throw new Error("Preencha todos os campos!");

  try {
    const categoryFetched = await findCategoryByName(category as string);
    if (!categoryFetched)
      throw new Error("Não existe categoria com esse nome!");

    const newProduct = await db.product.create({
      data: {
        name: name as string,
        description: description as string,
        imageUrl: imageUrl as string,
        price: price as string,
        category: {
          connect: {
            id: categoryFetched.id,
          },
        },
        discountPercentage: Number(discountPercentage),
        restaurant: {
          connect: {
            ownerId: ownerId as string,
          },
        },
      },
    });

    return newProduct;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

export const updateProduct = async (formData: FormData) => {
  const {
    id,
    name,
    imageUrl,
    price,
    discountPercentage,
    category,
    description,
    ownerId,
  } = Object.fromEntries(formData);

  try {
    const categoryFetched = await findCategoryByName(category as string);
    if (!categoryFetched) throw new Error("Essa não é uma categoria válida!");

    const updateFields: any = {
      name,
      imageUrl,
      price,
      discountPercentage,
      description,
      ownerId,
    };
    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || updateFields[key] === undefined) &&
        delete updateFields[key],
    );

    const updatedProduct = await db.product.update({
      where: {
        id: id as string,
      },
      data: {
        ...updateFields,
        discountPercentage: Number(updateFields.discountPercentage),
        category: {
          connect: {
            id: categoryFetched.id,
          },
        },
      },
    });
    revalidatePath(`/dashboard/products/${id}`);
    return updatedProduct;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

export const updateOrder = async (formData: FormData) => {
  const { status, id } = Object.fromEntries(formData);
  if (!status) throw new Error("Esse status é inválido!");
  try {
    const updatedOrder = await db.order.update({
      where: { id: id as string },
      data: {
        status: status as OrderStatus,
      },
    });
    revalidatePath("/my-orders");
    revalidatePath(`/dashboard/orders/${id}`);
    return updatedOrder;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

export const updateUser = async ({
  name,
  email,
  password,
  id,
}: SettingsInputs) => {
  try {
    const updateFields: any = {
      name,
      email,
      password,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || updateFields[key] === undefined) &&
        delete updateFields[key],
    );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(updateFields?.password, salt);

    const updatedUser = await db.user.update({
      where: { id },
      data: !updateFields.password
        ? updateFields
        : {
            ...updateFields,
            password: hashedPassword,
          },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return updatedUser;
  } catch (error: any) {
    console.error(error);
    throw new Error(`${error.message}`);
  }
};

const findCategoryByName = async (name: string) => {
  const category = await db.category.findFirst({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
  });
  return category;
};

export const verifyIfUserOwnsRestaurant = async (id: string) => {
  const user = await db.user.findFirst({
    where: { id },
    include: { ownRestaurant: true },
  });
  if (user?.ownRestaurant) return true;
  return false;
};
