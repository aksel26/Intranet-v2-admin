import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";
import * as api from "@/app/api/get/getApi";
import dayjs from "dayjs";

export default async function layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  // const now = {
  const sDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const eDate = dayjs().endOf("month").format("YYYY-MM-DD");

  // };
  await queryClient.prefetchQuery({
    queryKey: ["activities", { sDate, eDate }],
    queryFn: () => api.getActivities({ sDate, eDate }),
  });
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
