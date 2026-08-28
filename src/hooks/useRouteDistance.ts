import { useMutation } from "@tanstack/react-query";

import { fetchRouteDistance } from "@/lib/api/pricePrediction";

export const useRouteDistance = () => {
  return useMutation({
    mutationFn: fetchRouteDistance,
  });
};
