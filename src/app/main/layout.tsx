"use client";
import { AppShell, Burger, Button, Container, Flex, Group, Image, Kbd, NavLink, ScrollArea, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { UserInfo } from "../components/Global/UserInfo";
import { HEIGHT } from "../enums/design";
// import myImage from "/public/images/ACG_LOGO_GRAY.png";
import SearchBar from "../components/main/SearchBar";
import Header from "../components/nav/header";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  const router = useRouter();
  const movePage = (name: string) => {
    router.push(`/main/${name}`);
  };

  return (
    <AppShell
      layout="alt"
      header={{ height: HEIGHT.HEADER }}
      footer={{ height: HEIGHT.FOOTER }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <AppShell.Navbar p="md">
        <Header />

        <UserInfo />
        <ScrollArea type="scroll">
          <NavLink href="#required-for-focus" label="근태" childrenOffset={28}>
            <NavLink label="출퇴근 관리" onClick={() => movePage("attendance")} />
            <NavLink label="휴가/연차 관리" onClick={() => movePage("attendance/vacation")} />
            {/* <NavLink label="시간외 근무" onClick={() => movePage("attendance/overwork")} /> */}
            {/* <NavLink label="활동비 관리" /> */}
          </NavLink>
          <NavLink label="비용" childrenOffset={28}>
            <NavLink label="식대 관리">
              <NavLink label="사용내역" onClick={() => movePage("meal")} />
              {/* <NavLink label="통계" onClick={() => movePage("meal/stats")} /> */}
              <NavLink label="금액설정 및 정산" onClick={() => movePage("meal/settlement")} />
              {/* <NavLink label="점심조" onClick={() => movePage("meal/lunchGroup")} /> */}
            </NavLink>
            <NavLink label="복지포인트 관리">
              <NavLink label="사용내역" onClick={() => movePage("welfare")} />
              {/* <NavLink label="통계" onClick={() => movePage("welfare/stats")} /> */}
              <NavLink label="금액설정 및 정산" onClick={() => movePage("welfare/settlement")} />
              {/* <NavLink label="설정 ⛔️" onClick={() => movePage("welfare/config")} /> */}
            </NavLink>
            <NavLink label="활동비 관리">
              <NavLink label="사용내역" onClick={() => movePage("activity")} />
              {/* <NavLink label="통계" onClick={() => movePage("activity/stats")} /> */}
              <NavLink label="금액설정 및 정산" onClick={() => movePage("activity/settlement")} />
              {/* <NavLink label="설정" onClick={() => movePage("activity/config")} /> */}
            </NavLink>
          </NavLink>
          <NavLink label="설정" childrenOffset={28}>
            <NavLink label="직원정보 관리" onClick={() => movePage("staff")} />
            {/* <NavLink label="조직 관리" onClick={() => movePage("org")} /> */}

            {/* <NavLink label="활동비 관리" /> */}
          </NavLink>

          <NavLink label="기타" childrenOffset={28}>
            {/* <NavLink label="문의내역" onClick={() => movePage("qna")} /> */}
            <NavLink label="공지사항" onClick={() => movePage("notice")} />
            {/* <NavLink label="조직 관리" onClick={() => movePage("organization")} /> */}

            {/* <NavLink label="활동비 관리" /> */}
          </NavLink>
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main>
        <Container h={"calc(100vh - (var(--app-shell-footer-height) + var(--app-shell-header-height))"} fluid>
          {children}
        </Container>
      </AppShell.Main>
      <AppShell.Footer withBorder={false}>
        <Flex justify={"center"} align={"center"} h={"100%"}>
          <Text ta="center">© {dayjs().year()} ACG</Text>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
}

export default layout;
