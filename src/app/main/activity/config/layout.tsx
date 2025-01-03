import * as api from "@/app/api/get/getApi";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";

export default async function layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  const halfYear = "H1";

  await queryClient.prefetchQuery({
    queryKey: ["activitiesBudget", halfYear],
    queryFn: () => api.getActivitiesBudget(halfYear),
  });
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
