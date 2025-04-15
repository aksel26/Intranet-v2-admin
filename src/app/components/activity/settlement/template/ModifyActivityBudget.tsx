"use client";
import * as postApi from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, NumberInput, Stack, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type inputValues = {
  budgetPerMember: string | number;
  memberCount: string | number;
  extraBudget: string | number;
  activityBudget: string | number | undefined;
};

function ModifyActivityBudget({ opened, selectedRows, close }: any) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.modifyActivityBaseAmount(values),
  });

  const [inputValues, setInputValues] = useState<inputValues>({
    budgetPerMember: 0,
    memberCount: 0,
    extraBudget: 0,
    activityBudget: undefined,
  });
  const [activityBudget, setActivityBudget] = useState<string | number>(selectedRows?.activityBudget);

  const handleInput = (e: string | number, name: string) => {
    setInputValues((prev) => ({ ...prev, [name]: e }));
  };

  useEffect(() => {
    setActivityBudget(selectedRows?.activityBudget);
  }, [selectedRows]);

  useEffect(() => {
    const { budgetPerMember, memberCount, extraBudget } = inputValues;
    const calc = Number(budgetPerMember) * Number(memberCount) + Number(extraBudget);
    setActivityBudget(calc);
  }, [inputValues]);

  const modify = (values: any) => {
    const temp = { ...inputValues };
    temp.activityBudget = activityBudget;
    mutate(
      { params: selectedRows.activityStatsIdx, body: temp },
      {
        onSuccess: async () => {
          notification({ title: "활동비 금액 수정", message: "활동비 금액 수정이 완료되었습니다.", color: "green" });
          await queryClient.invalidateQueries({ queryKey: ["settlementActivities"] });
          close();
        },
        onError: () => {
          notification({ title: "활동비 금액 수정", message: "활동비 금액 수정 중 문제가 발생하였습니다.", color: "red" });
        },
      }
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Text fz={"md"} fw={500}>
          활동비 수정하기
          <Text component="span" fz={"xs"} ml={"xs"}>
            ({selectedRows?.userName})
          </Text>
        </Text>
      }
      centered
    >
      <Stack>
        <NumberInput
          required
          label="구성원 당 금액"
          size="xs"
          placeholder="구성원 당 금액을 입력해 주세요."
          suffix=" 원"
          thousandSeparator
          hideControls
          onChange={(e) => handleInput(e, "budgetPerMember")}
        />
        <NumberInput
          required
          label="구성원 인원 수"
          size="xs"
          placeholder="구성원 인원 수를 입력해 주세요."
          suffix=" 명"
          thousandSeparator
          hideControls
          onChange={(e) => handleInput(e, "memberCount")}
        />
        <NumberInput
          required
          label="추가 금액"
          size="xs"
          placeholder="추가 금액을 입력해 주세요."
          suffix=" 원"
          thousandSeparator
          hideControls
          onChange={(e) => handleInput(e, "extraBudget")}
        />

        <NumberInput
          required
          label="반영 예상 금액"
          size="xs"
          placeholder="금액 내용을 입력해 주세요."
          suffix=" 원"
          thousandSeparator
          hideControls
          readOnly
          value={activityBudget}
        />
        <Button type="submit" size="xs" fullWidth mt={"sm"} onClick={modify}>
          수정하기
        </Button>
      </Stack>

      <Group justify="flex-end" mt={"xs"}></Group>
    </Modal>
  );
}

export default ModifyActivityBudget;
