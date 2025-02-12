import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";
import * as api from "@/app/api/get/getApi";
import dayjs from "dayjs";

export default async function layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  // const now = {
  const year = dayjs().year();

  // };
  await queryClient.prefetchQuery({
    queryKey: ["vacations", { year }],
    queryFn: () => api.getVacations({ year }),
  });
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
