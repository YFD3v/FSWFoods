"use client";
import { Button } from "@/app/_components/ui/button";
import { Category } from "@prisma/client";
import styles from "./addProduct.module.css";
import { toast } from "sonner";
import { createProduct } from "@/app/dashboard/_actions/actions";
import { useRef } from "react";

interface FormAddProductProps {
  ownerId: string;
  categories: Category[];
}

const FormAddProduct = ({ categories, ownerId }: FormAddProductProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    try {
      await createProduct(formData);
      formRef.current.reset();
      toast.success("Produto criado com sucesso!");
    } catch (error: any) {
      toast.error(`Houve um erro ao tentar criar o produto: ${error.message}`);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
      <input
        type="hidden"
        name="ownerId"
        id="ownerId"
        value={ownerId}
        required
      />
      <input type="text" name="name" id="name" placeholder="Name" required />

      <input
        type="text"
        name="imageUrl"
        id="imageUrl"
        placeholder="Image Url"
        required
      />

      <input
        type="number"
        step={1}
        min={0}
        name="discountPercentage"
        id="discountPercentage"
        placeholder="Discount Percentage"
        required
      />

      <input
        type="number"
        step={0.01}
        min={0.05}
        name="price"
        id="price"
        placeholder="Price"
        required
      />

      <select required name="category" id="category">
        <option disabled>Which?</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <textarea
        name="description"
        id="description"
        placeholder="Description"
      ></textarea>
      <Button type="submit">Criar</Button>
    </form>
  );
};

export default FormAddProduct;
