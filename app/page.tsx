import Header from "./_components/Header";
import Search from "./_components/Search";

export default function Home() {
  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>
    </>
  );
}
