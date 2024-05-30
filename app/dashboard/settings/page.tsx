import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import styles from "@/app/_components/Dashboard/settings/settings.module.css";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import SettingsForm from "@/app/_components/Dashboard/settings/SettingsForm";
import ButtonDeleteUserOrRestaurant from "@/app/_components/Dashboard/ButtonDeleteUserOrRestaurant";

const SettingsPage = async () => {
  const session = await getServerSession(authOptions);
  const user = await db.user.findFirst({
    where: {
      id: session?.user?.id,
    },
  });
  if (!user || !session) redirect("/signin");
  const placeholders = [user.name as string, user.email as string];
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image
            src={
              "https://img.redbull.com/images/c_crop,x_1489,y_0,h_1998,w_1998/c_fill,w_350,h_350/q_auto:low,f_auto/redbullcom/2022/11/23/bmjrydcmhq9ruadewjcf/futebol-neymar-jrs-five-final-mundial-2022"
            }
            alt={user.name as string}
            fill
          />
        </div>
        {user.name}
      </div>
      <div className={styles.formContainer}>
        <SettingsForm placeholders={placeholders} />
        <ButtonDeleteUserOrRestaurant id={user.id} type="User" />
      </div>
    </div>
  );
};

export default SettingsPage;
