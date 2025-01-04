import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";
import * as api from "@/app/api/get/getApi";
import dayjs from "dayjs";

export default async function layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  // const now = {
  const year = dayjs().year();
  const month = dayjs().month() + 1;
  // };
  await queryClient.prefetchQuery({
    queryKey: ["mealsBudget", { year, month }],
    queryFn: () => api.getMealsBudget({ year, month }),
  });
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
