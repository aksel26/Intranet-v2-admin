import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";
import * as api from "@/app/api/get/getApi";
import dayjs from "dayjs";

export default async function layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  // const now = {
  const pageNo = 1;

  // };
  await queryClient.prefetchQuery({
    queryKey: ["staffs", { pageNo }],
    queryFn: () => api.getMeals({ pageNo }),
  });
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
