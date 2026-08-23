import { useMutation } from "@tanstack/react-query";

import { fetchPricePrediction } from "@/lib/api/pricePrediction";

export const usePricePrediction = () => {
  return useMutation({
    mutationFn: fetchPricePrediction,
  });
};
