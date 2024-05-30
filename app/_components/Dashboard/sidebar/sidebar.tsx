"use client";
import styles from "./sidebar.module.css";
import MenuLink from "./menuLink/menuLink";
import {
  MdDashboard,
  MdOutlineSettings,
  MdLogout,
  MdRestaurant,
  MdShoppingBag,
} from "react-icons/md";
import { FaCartFlatbed } from "react-icons/fa6";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Products",
        path: "/dashboard/products",
        icon: <FaCartFlatbed />,
      },
      {
        title: "Orders",
        path: "/dashboard/orders",
        icon: <MdShoppingBag />,
      },
      {
        title: "Restaurant Settings",
        path: "/dashboard/restaurant",
        icon: <MdRestaurant />,
      },
    ],
  },
  {
    title: "User",
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings />,
      },
    ],
  },
];

const Sidebar = ({ username }: { username: string }) => {
  const { data: session } = useSession();
  if (!session) return;
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src={
            "https://img.redbull.com/images/c_crop,x_1489,y_0,h_1998,w_1998/c_fill,w_350,h_350/q_auto:low,f_auto/redbullcom/2022/11/23/bmjrydcmhq9ruadewjcf/futebol-neymar-jrs-five-final-mundial-2022"
          }
          alt={username}
          width={50}
          height={50}
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>{username}</span>
          <span className={styles.userTitle}>Administrator</span>
        </div>
      </div>
      <ul className={styles.list}>
        {menuItems.map((category) => (
          <li key={category.title}>
            <span className={styles.category}>{category.title}</span>
            {category.list.map((item) => (
              <MenuLink key={item.title} item={item} />
            ))}
          </li>
        ))}
      </ul>

      <button
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className={styles.logout}
      >
        <MdLogout />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
