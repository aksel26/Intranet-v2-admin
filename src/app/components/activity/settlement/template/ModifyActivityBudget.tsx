"use client";
import * as postApi from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, NumberInput, Stack, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
function ModifyActivityBudget({ opened, element, close }: any) {
  console.log("🚀 ~ ModifyActivityBudget ~ element:", element);
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.modifyActivityBaseAmount(values),
  });

  const [formValues, setFormValues] = useState({
    budgetPerMember: 10000,
    memberCount: undefined,
    activityBudget: 0,
    extraBudget: undefined,
  });

  const queryClient = useQueryClient();
  const modify = () => {
    console.log("🚀 ~ modify ~ formValues:", formValues);
    mutate(
      { params: element.activityStatsIdx, body: formValues },
      {
        onSuccess: async () => {
          notification({ title: "활동비 비고 수정", message: "활동비 비고 수정이 완료되었습니다.", color: "green" });
          await queryClient.invalidateQueries({ queryKey: ["settlementActivities"] });
          close();
        },
        onError: () => {
          notification({ title: "활동비 비고 수정", message: "활동비 비고 수정 중 문제가 발생하였습니다.", color: "red" });
        },
      }
    );
  };

  useEffect(() => {
    const activityBudget: number | undefined =
      Number(formValues.budgetPerMember || 0) * Number(formValues.memberCount || 0) + Number(formValues.extraBudget || 0);
    setFormValues({ ...formValues, activityBudget: activityBudget });
  }, [formValues.budgetPerMember, formValues.memberCount, formValues.extraBudget]);

  const handleActivityBudget = (e: any) => {
    setFormValues({ ...formValues, budgetPerMember: e });
  };
  const handleActivityPeople = (e: any) => {
    setFormValues({ ...formValues, memberCount: e });
  };
  const handleActivityExtraBudget = (e: any) => {
    setFormValues({ ...formValues, extraBudget: e });
  };

  const closeModal = () => {
    setFormValues({
      budgetPerMember: 10000,
      memberCount: undefined,
      activityBudget: element.activityBudget,
      extraBudget: undefined,
    });

    close();
  };
  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      title={
        <Text fz={"md"} fw={500}>
          활동비 수정하기
          <Text component="span" fz={"xs"} ml={"xs"}>
            ({element.userName})
          </Text>
        </Text>
      }
      centered
    >
      {/* <form onSubmit={form.onSubmit(modify)}> */}
      <Stack>
        <NumberInput
          // key={form.key("budgetPerMember")}
          // {...form.getInputProps("budgetPerMember")}
          required
          label="구성원 당 금액"
          size="xs"
          placeholder="구성원 당 금액을 입력해 주세요."
          suffix=" 원"
          thousandSeparator
          hideControls
          value={formValues.budgetPerMember}
          onChange={handleActivityBudget}
        />
        <NumberInput
          // key={form.key("memberCount")}
          // {...form.getInputProps("memberCount")}
          required
          label="구성원 인원 수"
          size="xs"
          placeholder="구성원 인원 수를 입력해 주세요."
          suffix=" 명"
          thousandSeparator
          hideControls
          value={formValues.memberCount}
          onChange={handleActivityPeople}
        />
        <NumberInput
          // key={form.key("extraBudget")}
          // {...form.getInputProps("extraBudget")}
          required
          label="추가 금액"
          size="xs"
          placeholder="추가 금액을 입력해 주세요."
          suffix=" 원"
          thousandSeparator
          hideControls
          value={formValues.extraBudget}
          onChange={handleActivityExtraBudget}
        />

        <NumberInput
          // key={form.key("activityBudget")}
          // {...form.getInputProps("activityBudget")}
          required
          label="반영 예상 금액"
          size="xs"
          placeholder="비고 내용을 입력해 주세요."
          suffix=" 원"
          thousandSeparator
          hideControls
          readOnly
          value={formValues.activityBudget}
        />
        <Button type="submit" size="xs" fullWidth mt={"sm"} onClick={modify}>
          수정하기
        </Button>
      </Stack>
      {/* </form> */}

      <Group justify="flex-end" mt={"xs"}></Group>
    </Modal>
  );
}

export default ModifyActivityBudget;
