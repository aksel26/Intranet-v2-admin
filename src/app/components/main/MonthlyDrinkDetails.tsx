"use client";
import { updateDrinkDetail } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Group, Modal, ScrollArea, Select, Stack, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";

const MonthlyDrinkDetails = ({ opened, close, details, configId }: any) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (values: any) => updateDrinkDetail(values),
  });

  const submit = (value: any, record: any) => {
    const param = {
      baverage: value,
      userName: record.userName,
      configId: configId,
    };
    mutate(
      { body: param },
      {
        onSuccess: () => {
          notification({ color: "green", message: "음료신청이 완료되었습니다.", title: "음료신청" });
          queryClient.invalidateQueries({ queryKey: ["monthlyDrink"] });
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
          notification({ color: "red", message: errorMessage, title: "음료신청" });
        },
      }
    );
  };

  return (
    <Modal opened={opened} onClose={close} centered title="신청 내역 확인" pb={"md"}>
      <ScrollArea h={"80vh"} pb={"sm"}>
        <Stack gap={0}>
          {details?.map((item: any, index: number) => (
            <Group key={index} wrap="nowrap">
              <Text w={10} fz={"xs"}>
                {index + 1}.
              </Text>
              <Text fz={"xs"}>{item.userName}</Text>
              <Select
                variant="unstyled"
                size="xs"
                flex={1}
                onChange={(value) => submit(value, item)}
                value={item.baverage}
                data={[
                  "HOT 아메리카노",
                  "ICE 아메리카노",
                  "HOT 디카페인 아메리카노",
                  "ICE 디카페인 아메리카노",
                  "바닐라크림 콜드브루",
                  "ICE 자몽허니블랙티",
                  "선택안함",
                ]}
                fz={"xs"}
                placeholder="음료를 선택해 주세요."
              />
            </Group>
          ))}
        </Stack>
      </ScrollArea>
    </Modal>
  );
};

export default MonthlyDrinkDetails;
