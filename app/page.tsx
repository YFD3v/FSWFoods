import Image from "next/image";
import CategoryList from "./_components/CategoryList";
import Header from "./_components/Header";
import Search from "./_components/Search";
import ProductsList from "./_components/ProductsList";
import { Button } from "./_components/ui/button";
import { ChevronRightIcon } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>
      <div className="px-5 pt-6">
        <CategoryList />
      </div>
      <div className="px-5 pt-6">
        <Image
          src="/promo-banner-01.png"
          alt="Até 30% de desconto em pizza"
          width={0}
          height={0}
          className="h-auto w-full"
          sizes="100vw"
          quality={100}
        />
      </div>
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between px-5 ">
          <h2 className="font-semibold">Pedidos Recomendados</h2>
          <Button
            variant="ghost"
            className="h-fit p-0 text-primary hover:bg-transparent"
          >
            Ver Todos <ChevronRightIcon size={16} />
          </Button>
        </div>

        <ProductsList />
      </div>
    </>
  );
}
