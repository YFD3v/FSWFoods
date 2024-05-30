"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./pagination.module.css";

interface PaginationProps {
  count: number;
}

const Pagination = ({ count }: PaginationProps) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const page = searchParams.get("page") || "1";
  const q = searchParams.get("q") || "";
  const params = new URLSearchParams(pathname);
  const ITEM_PER_PAGE = 2;
  const hasPrev = ITEM_PER_PAGE * (parseInt(page) - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (parseInt(page) - 1) + ITEM_PER_PAGE < count;
  const handleChangePage = (type: string) => {
    type === "prev"
      ? params.set("page", String(parseInt(page) - 1))
      : params.set("page", String(parseInt(page) + 1));
    params.set("q", q);
    replace(`${pathname}?${params}`);
  };

  return (
    <div className={styles.container}>
      <button
        disabled={!hasPrev}
        className={styles.button}
        onClick={() => handleChangePage("prev")}
      >
        Previous
      </button>
      <button
        disabled={!hasNext}
        className={styles.button}
        onClick={() => handleChangePage("next")}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
