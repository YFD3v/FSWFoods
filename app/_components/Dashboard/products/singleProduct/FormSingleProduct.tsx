"use client";
import { Category, Prisma } from "@prisma/client";
import styles from "./singleProduct.module.css";
import { useRef } from "react";
import { toast } from "sonner";
import { updateProduct } from "@/app/dashboard/_actions/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";

interface FormSingleProductProps {
  product: Prisma.ProductGetPayload<{
    include: {
      category: true;
    };
  }>;
  categories: Category[];
}

const FormSingleProduct = ({ product, categories }: FormSingleProductProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    try {
      await updateProduct(formData);
      formRef.current.reset();
      toast.success("Produto atualizado com sucesso!");
      router.push("/dashboard/products");
    } catch (error: any) {
      toast.error(
        `Houve um erro ao tentar atualizar o produto: ${error.message}`,
      );
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
      <input type="hidden" value={product.id} name="id" />
      <label htmlFor="name">Name</label>
      <input type="text" name="name" id="name" placeholder={product.name} />
      <label htmlFor="img">Image Url</label>
      <input type="text" name="img" id="img" placeholder={product.imageUrl} />
      <label htmlFor="discountPercentage">Discount Percentage</label>
      <input
        type="number"
        step={1}
        min={0}
        name="discountPercentage"
        id="discountPercentage"
        placeholder={String(product.discountPercentage)}
      />
      <label htmlFor="price">Price</label>
      <input
        type="number"
        step={0.01}
        min={0.05}
        name="price"
        id="price"
        placeholder={`${String(product.price)}`}
      />

      <label htmlFor="category">Category</label>
      <select name="category" id="category">
        {categories.map((category) => (
          <option
            key={category.id}
            selected={product.category.name === category.name}
            value={category.name}
          >
            {category.name}
          </option>
        ))}
      </select>

      <label htmlFor="description">Description</label>
      <textarea
        name="description"
        id="description"
        placeholder={product.description}
      ></textarea>

      <Button type="submit">Atualizar</Button>
    </form>
  );
};

export default FormSingleProduct;
