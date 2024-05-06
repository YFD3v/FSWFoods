import Image from "next/image";
import CategoryList from "./_components/CategoryList";
import Header from "./_components/Header";
import Search from "./_components/Search";

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
    </>
  );
}
