"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서는 클라이언트에서 즉시 refetch하는 것을 피하기 위해
        // staleTime을 0보다 크게 설정하는 것이 좋다.
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server일 경우
    // 매번 새로운 queryClient를 만든다.
    return makeQueryClient();
  } else {
    // Browser일 경우
    // queryClient가 존재하지 않을 경우에만 새로운 queryClient를 만든다.
    // React가 새 Client를 만들게 하기 위해 중요하다.
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const theme = createTheme({
    defaultRadius: "md",
    fontFamily:
      "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, Helvetica Neue, Segoe UI, Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, sans-serif",
    headings: {
      fontFamily:
        "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, Helvetica Neue, Segoe UI, Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, sans-serif",
    },
    cursorType: "pointer",
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <MantineProvider theme={theme}>
        <Notifications />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}
