/* eslint-disable no-unused-vars */
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Label } from "../ui/label";
import { SetStateAction, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { ProductsInputs } from "./CreateRestaurantForm";

interface ProducstInputsFormProps {
  products: ProductsInputs[];
  setProducts: (value: SetStateAction<ProductsInputs[]>) => void;
}

const ProductsInputsForm = ({
  setProducts,
  products,
}: ProducstInputsFormProps) => {
  const [quantityInputsServices, setQuantityInputsServices] = useState<
    number[]
  >([]);
  const [quantity, setQuantity] = useState(0);
  const handleDelete = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    setQuantityInputsServices((prevState) =>
      prevState.filter((_, i) => i !== index),
    );
  };

  const handleProductInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { name, value } = e.target;
    setProducts((prevProducts) => {
      // Faz uma cópia do array de produtos
      const updatedProducts = [...prevProducts];

      // Atualiza apenas o item no índice especificado
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: value,
      };

      return updatedProducts;
    });
  };

  useEffect(() => {
    let newQuantityInputsServices: number[] = [];
    for (let i = 0; i < quantity; i++) {
      newQuantityInputsServices.push(i + 1);
    }
    setQuantityInputsServices(newQuantityInputsServices);
    setProducts([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity]);

  return (
    <>
      <div className="w-full">
        <Label>Quantos produtos deseja?</Label>
        <Select onValueChange={(e: string) => setQuantity(parseInt(e))}>
          <SelectTrigger className="w-[180px] bg-transparent">
            <SelectValue placeholder="Selecione a quantidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0</SelectItem>
            {Array.from({ length: 20 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 w-full">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[--bgSoft]">
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Imagem</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Porcentagem de desconto</TableHead>
              <TableHead>Categorias</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quantityInputsServices.map((_, index) => (
              <TableRow className="hover:bg-[--bgSoft]" key={index}>
                <TableCell>
                  <Input
                    value={products[index]?.name}
                    required
                    name="name"
                    placeholder="Nome"
                    className="w-full bg-transparent"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleProductInputChange(e, index)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={products[index]?.description}
                    required
                    name="description"
                    placeholder="Descrição"
                    className="w-full bg-transparent"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleProductInputChange(e, index)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={products[index]?.imageUrl}
                    required
                    name="imageUrl"
                    placeholder="https://link.com"
                    className="w-full bg-transparent"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleProductInputChange(e, index)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={products[index]?.price}
                    required
                    name="price"
                    placeholder="15"
                    className="w-full bg-transparent"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleProductInputChange(e, index)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={products[index]?.discountPercentage}
                    required
                    name="discountPercentage"
                    placeholder="15"
                    className="w-full bg-transparent"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleProductInputChange(e, index)
                    }
                  />
                </TableCell>

                <TableCell>
                  <Input
                    type="text"
                    required
                    name="category"
                    className="bg-transparent"
                    placeholder={"Igual nos restaurantes"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleProductInputChange(e, index)
                    }
                  />
                  <p className="text-sm font-light text-gray-500">
                    OBRIGATÓRIO SEPARAR POR VÍRGULAS
                  </p>
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    className="ml-2 h-[18px] w-[18px]"
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
                      handleDelete(e, index)
                    }
                  >
                    <Trash scale="1.05" size="16px" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ProductsInputsForm;
