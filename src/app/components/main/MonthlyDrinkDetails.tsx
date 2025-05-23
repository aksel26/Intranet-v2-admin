"use client";
import { Group, Modal, ScrollArea, Select, Stack, Text } from "@mantine/core";
import React from "react";

const MonthlyDrinkDetails = ({ opened, close, details }: any) => {
  if (!details) return null;
  return (
    <Modal opened={opened} onClose={close} centered title="신청 내역 확인" pb={"md"}>
      <ScrollArea h={"80vh"} pb={"sm"}>
        <Stack gap={0}>
          {details.map((item: any, index: number) => (
            <Group key={index} wrap="nowrap">
              <Text w={10} fz={"xs"}>
                {index + 1}.
              </Text>
              <Text fz={"xs"}>{item.userName}</Text>
              <Select
                variant="unstyled"
                size="xs"
                flex={1}
                value={item.baverage}
                data={[
                  "NONE",
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
