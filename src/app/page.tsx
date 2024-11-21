"use client";

import { AppShell, Button, Center, Container, Flex, Image, Paper, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import NextImage from "next/image";
import myImage from "/public/images/ACG_LOGO_GRAY.png";
import { useRouter } from "next/navigation";
import notification from "./utils/notification";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function Home() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      id: "",
      password: "",
    },
  });

  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: (values: any) => {
      return axios.post("https://test-acg-playground.insahr.co.kr/login/admin", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const login = (value: any) => {
    mutate(value, {
      onSuccess: (res: any) => {
        const { data } = res.data;
        router.push("/main");
        sessionStorage.setItem("user", JSON.stringify(data));
      },
      onError: (error: any) => {
        const { status } = error;
        const { message } = error.response.data;
        if (status === 400 || status === 401) {
          notification({
            title: "로그인 오류",
            color: "red",
            message: message,
          });
        }
      },
    });
  };
  return (
    <AppShell header={{ height: 50 }} footer={{ height: 50 }}>
      <AppShell.Header withBorder={false}>
        <Flex align={"center"} h={"100%"} pl={"md"}>
          <Image component={NextImage} src={myImage} alt="My image" fit="contain" h={20} w={80} style={{ cursor: "pointer" }} />
        </Flex>
      </AppShell.Header>
      <AppShell.Main>
        <Container h={"calc(100vh - 87px)"}>
          <Center h={"100%"}>
            <Paper shadow="xl" radius="lg" p="xl" w={300}>
              <form onSubmit={form.onSubmit(login)}>
                <Stack>
                  <Text fw={800} size="lg">
                    관리자 사이트
                  </Text>
                  <TextInput withAsterisk label="ID" placeholder="ID를 입력하세요." key={form.key("id")} {...form.getInputProps("id")} />
                  <PasswordInput
                    withAsterisk
                    label="비밀번호"
                    placeholder="비밀번호를 입력하세요."
                    key={form.key("password")}
                    {...form.getInputProps("password")}
                  />

                  <Button fullWidth type="submit">
                    로그인
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Center>
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
