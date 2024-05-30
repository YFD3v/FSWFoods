import React, { ReactNode } from "react";
import styles from "@/app/_components/Dashboard/dashboard.module.css";
import Sidebar from "../_components/Dashboard/sidebar/sidebar";
import Navbar from "../_components/Dashboard/navbar/navbar";
import Footer from "../_components/Dashboard/footer/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { db } from "../_lib/prisma";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}
const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  const user = await db.user.findFirst({
    where: { id: session?.user.id },
    include: {
      ownRestaurant: true,
    },
  });

  if (!session || !user || user.role === "CLIENT") redirect("/signin");

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar username={user.name as string} />
      </div>
      <div className={styles.content}>
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
