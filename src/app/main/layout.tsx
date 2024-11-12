"use client";
import { AppShell, Burger, Center, Container, Flex, Group, Image, NavLink, ScrollArea, Skeleton, Text } from "@mantine/core";
import NextImage from "next/image";
import React from "react";
import myImage from "/public/images/ACG_LOGO_GRAY.png";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";

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
    <AppShell header={{ height: 50 }} footer={{ height: 50 }} navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}>
      <AppShell.Header withBorder={false}>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

          <Image
            component={NextImage}
            src={myImage}
            alt="My image"
            fit="contain"
            h={20}
            w={80}
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/main")}
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavLink href="#required-for-focus" label="복지" childrenOffset={28}>
          <NavLink href="#required-for-focus" label="식대 관리">
            <NavLink label="조회" onClick={() => movePage("meal")} />
            <NavLink label="통계" onClick={() => movePage("meal/stats")} />
            <NavLink label="정산" onClick={() => movePage("meal/settlement")} />
            <NavLink label="설정" onClick={() => movePage("meal/config")} />
          </NavLink>
          <NavLink label="복지포인트 관리" href="#required-for-focus" />
          <NavLink label="활동비 관리" />
        </NavLink>
        <NavLink href="#required-for-focus" label="근태" childrenOffset={28}>
          <NavLink href="#required-for-focus" label="근태 관리" />
          <NavLink label="휴가 관리" href="#required-for-focus" />
          {/* <NavLink label="활동비 관리" /> */}
        </NavLink>
        <NavLink href="#required-for-focus" label="설정" childrenOffset={28}>
          <NavLink href="#required-for-focus" label="직원정보 관리" />

          {/* <NavLink label="활동비 관리" /> */}
        </NavLink>
      </AppShell.Navbar>
      <AppShell.Main>
        <Container h={"calc(100vh - 87px)"} fluid>
          {children}
        </Container>
      </AppShell.Main>
      <AppShell.Footer withBorder={false}>
        <Flex justify={"center"} align={"center"} h={"100%"}>
          <Text ta="center">© 2024 ACG</Text>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
}

export default layout;
