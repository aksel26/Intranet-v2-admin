import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";
import * as api from "@/app/api/get/getApi";

export default async function layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  // const now = {
  const sDate = "2024-11-01";
  const eDate = "2024-11-31";
  // };
  await queryClient.prefetchQuery({
    queryKey: ["meals", { sDate, eDate }],
    queryFn: () => api.getMeals({ sDate, eDate }),
  });
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
