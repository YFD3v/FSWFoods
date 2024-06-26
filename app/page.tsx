import CategoryList from "./_components/CategoryList";
import Header from "./_components/Header";
import Search from "./_components/Search";
import ProductsList from "./_components/ProductsList";
import { Button } from "./_components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { db } from "./_lib/prisma";
import PromoBanner from "./_components/PromoBanner";
import RestaurantsList from "./_components/RestaurantsList";
import Link from "next/link";

const fetch = async () => {
  const getProducts = db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 10,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  const getBurguersCategory = db.category.findFirst({
    where: {
      name: "Hambúrgueres",
    },
  });

  const getPizzasCategory = db.category.findFirst({
    where: {
      name: "Pizzas",
    },
  });

  const [products, burguersCategory, pizzasCategory] = await Promise.all([
    getProducts,
    getBurguersCategory,
    getPizzasCategory,
  ]);

  return { products, burguersCategory, pizzasCategory };
};

export default async function Home() {
  const { products, burguersCategory, pizzasCategory } = await fetch();
  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>
      <div className="pt-6">
        <CategoryList />
      </div>
      <div className="px-5 pt-6">
        <Link href={`/categories/${pizzasCategory?.id}/products`}>
          <PromoBanner
            src="/promo-banner-01.png"
            alt="Até 30% de desconto em pizzas!"
          />
        </Link>
      </div>
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between px-5 ">
          <h2 className="font-semibold">Pedidos Recomendados</h2>
          <Button
            variant="ghost"
            className="h-fit p-0 text-primary hover:bg-transparent"
            asChild
          >
            <Link href="/products/recommended">
              Ver Todos <ChevronRightIcon size={16} />
            </Link>
          </Button>
        </div>

        <ProductsList products={products} />
      </div>

      <div className="px-5 pt-6">
        <Link href={`/categories/${burguersCategory?.id}/products`}>
          <PromoBanner
            src="/promo-banner-02.png"
            alt="A partir de R$17,90 em lanches"
          />
        </Link>
      </div>

      <div className="space-y-4 py-6">
        <div className="flex items-center justify-between px-5 ">
          <h2 className="font-semibold">Restaurantes Recomendados</h2>
          <Button
            variant="ghost"
            className="h-fit p-0 text-primary hover:bg-transparent"
            asChild
          >
            <Link href="/restaurants/recommended">
              Ver Todos <ChevronRightIcon size={16} />
            </Link>
          </Button>
        </div>

        <RestaurantsList />
      </div>
    </>
  );
}
