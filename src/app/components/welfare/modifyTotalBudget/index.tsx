"use client";
import React from "react";

import * as postApi from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, NumberFormatter, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { IconArrowRight } from "@tabler/icons-react";

function ModifyTotalBudget({ newTotalBudget, close, opened, selectedRows }: any) {
  const queyrClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.updateWelfarePointByPerson(values),
  });

  const modifyNote = async () => {
    mutate(
      { body: { welfareBudget: newTotalBudget }, params: selectedRows.welfareStatsIdx },
      {
        onError: (error) => {
          notification({
            color: "red",
            title: "복지포인트 총 금액 수정",
            message: "복지포인트 총 금액 수정에 실패하였습니다.",
          });
        },
        onSuccess: async (data) => {
          await queyrClient.invalidateQueries({ queryKey: ["settlementWelfare"] });
          notification({
            color: "green",
            title: "복지포인트 총 금액 수정",
            message: "복지포인트 총 금액이 수정되었습니다.",
          });
          close();
        },
      }
    );
  };

  return (
    <Modal opened={opened} onClose={close} title="총 금액 수정" centered>
      <Stack gap="md">
        <Stack gap={2} mb={"md"}>
          <Text c={"dimmed"} fz={"sm"} w={60}>
            성명
          </Text>
          <Text fw={500} fz={"sm"}>
            {selectedRows?.userName}
          </Text>
        </Stack>
        <Group>
          <Stack gap={2} mb={"md"}>
            <Text c={"dimmed"} fz={"sm"}>
              수정 전 금액
            </Text>

            <NumberFormatter
              style={{ fontSize: "var(--mantine-font-size-sm)", fontWeight: 500 }}
              thousandSeparator
              value={selectedRows?.welfareBudget}
              suffix=" 원"
            />
          </Stack>
          <IconArrowRight />
          <Stack gap={2} mb={"md"}>
            <Text c={"dimmed"} fz={"sm"}>
              수정 후 금액
            </Text>

            {newTotalBudget ? (
              <NumberFormatter style={{ fontSize: "var(--mantine-font-size-sm)", fontWeight: 500 }} thousandSeparator value={newTotalBudget} suffix=" 원" />
            ) : (
              <Text fz={"sm"} c={"dimmed"}>
                금액 변동이 없습니다.
              </Text>
            )}
          </Stack>
        </Group>

        <Group wrap="nowrap">
          <Button data-autofocus disabled={!newTotalBudget} fullWidth size="sm" type="submit" onClick={modifyNote}>
            수정
          </Button>
          <Button fullWidth size="sm" color="gray" onClick={close} variant="light">
            닫기
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default ModifyTotalBudget;
