import { MdAnalytics } from "react-icons/md";
import styles from "./card.module.css";
import { Category } from "@prisma/client";

interface CardAdminProps {
  name?: string;
  totalProducts?: number;
  totalOrders?: number;
  categories?: Category[];
  totalProductsCategories?: {
    category: string;
    count: number;
  }[];
}

const Card = ({
  name,
  totalOrders,
  totalProducts,
  categories,
  totalProductsCategories,
}: CardAdminProps) => {
  return (
    <div className={styles.container}>
      <MdAnalytics size={24} />
      <div className={styles.texts}>
        <span className={styles.title}>Total {name}</span>
        <span className={styles.number}>
          {name === "Products" && `${totalProducts} registered`}
          {name === "Orders" && `${totalOrders} ordered`}
          {name === "Categories" &&
            `${categories?.length} different in database`}
        </span>
        {name === "Categories" && (
          <div className="flex flex-wrap gap-4">
            {totalProductsCategories?.map(({ category, count }, index) => (
              <span className={styles.detail} key={index}>
                You have {count} in {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
