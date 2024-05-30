"use client";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { Instagram } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <div className={styles.title}>{pathname.split("/").pop()}</div>
      <div className={styles.menu}>
        <Link href={"https://www.instagram.com/yf.dev/"} target="_blank">
          <Instagram />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
