import { Button, Group, Image } from "@mantine/core";
import React from "react";
import NextImage from "next/image";
import LOGO from "/public/images/ACG_LOGO_GRAY.png";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { adminLogout } from "@/app/api/post/postApi";
import { AxiosError } from "axios";
import notification from "@/app/utils/notification";
const Header = () => {
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: () => adminLogout(),
  });
  const logout = () => {
    mutate(undefined, {
      onError: (error: Error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
        notification({ color: "red", message: errorMessage, title: "로그아웃" });
      },
      onSuccess: () => {
        notification({ color: "green", message: "로그아웃되었습니다.", title: "로그아웃" });
        router.push("/");
        sessionStorage.removeItem("user");
      },
    });
  };

  return (
    <Group justify="space-between">
      <Image
        component={NextImage}
        src={LOGO}
        alt="My image"
        fit="contain"
        h={20}
        w={80}
        my={"lg"}
        style={{ cursor: "pointer" }}
        onClick={() => router.push("/main")}
      />
      <Button variant="light" size="xs" onClick={logout}>
        로그아웃
      </Button>
    </Group>
  );
};

export default Header;
