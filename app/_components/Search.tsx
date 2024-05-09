"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const Search = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search) return;
    router.push(`/restaurants?searchFor=${search}`);
  };

  return (
    <form className="flex gap-2 " onSubmit={handleSubmit}>
      <Input
        onChange={handleChange}
        value={search}
        placeholder="Buscar restaurantes"
        className="border-none"
      />
      <Button type="submit" size="icon">
        <SearchIcon size={18} />
      </Button>
    </form>
  );
};

export default Search;
