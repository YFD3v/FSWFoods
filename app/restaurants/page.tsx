import { Suspense } from "react";
import Restaurants from "./_components/Restaurants";

const RestaurantsPage = () => {
  return (
    <Suspense>
      <Restaurants />
    </Suspense>
  );
};

export default RestaurantsPage;
