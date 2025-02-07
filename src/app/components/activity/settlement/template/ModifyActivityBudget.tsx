"use client";
import { Button, Group, Modal, NumberInput, Popover, Stack, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import IconArrowRight from "/public/icons/arrow-right.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as postApi from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { useForm } from "@mantine/form";
function ModifyActivityBudget({ opened, element, close }: any) {
  console.log("🚀 ~ ModifyActivityBudget ~ element:", element);
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.modifyActivityBaseAmount(values),
  });

  const [formValues, setFormValues] = useState({
    budgetPerMember: undefined,
    memberCount: undefined,
    activityBudget: 0,
    extraBudget: undefined,
  });

  // const form = useForm({
  //   mode: "controlled",
  //   initialValues: {
  //     budgetPerMember: null,
  //     memberCount: null,
  //     extraBudget: null,
  //     activityBudget: null,
  //   },
  // });
  // {
  //   "budgetPerMember": 200000,
  //   "memberCount": 7,
  //   "extraBudget": 10000,
  //   "activityBudget": 1410000
  // }

  const queryClient = useQueryClient();
  const modify = (formValues: any) => {
    console.log("🚀 ~ modify ~ formValues:", formValues);
    const { activityStatsIdx } = element;
    // mutate(
    //   { params: activityStatsIdx, body:  formValues},
    //   {
    //     onSuccess: async () => {
    //       notification({ title: "활동비 비고 수정", message: "활동비 비고 수정이 완료되었습니다.", color: "green" });
    //       await queryClient.invalidateQueries({ queryKey: ["settlementActivities"] });
    //       close();
    //     },
    //     onError: () => {
    //       notification({ title: "활동비 비고 수정", message: "활동비 비고 수정 중 문제가 발생하였습니다.", color: "red" });
    //     },
    //   }
    // );
  };

  // form.watch('name', ({ previousValue, value, touched, dirty }) => {
  //   console.log({ previousValue, value, touched, dirty });
  // });

  // useEffect(() => {
  //   const { budgetPerMember, memberCount, extraBudget } = form.getValues();
  //   console.log("🚀 ~ useEffect ~ form.values:", form.values);

  //   // 모든 필수 값이 입력되었을 때만 계산
  //   if (budgetPerMember !== "" && memberCount !== "" && extraBudget !== "") {
  //     const calculatedResult: any = (budgetPerMember || 0) + (memberCount || 0) * (extraBudget || 0);
  //     form.setFieldValue("activityBudget", calculatedResult);
  //   }
  // }, [form]);

  useEffect(() => {
    const activityBudget: number | undefined = Number(formValues.budgetPerMember || 0) * Number(formValues.memberCount || 0);
    setFormValues({ ...formValues, activityBudget: activityBudget });
  }, [formValues.budgetPerMember, formValues.memberCount]);

  const handleActivityBudget = (e: any) => {
    setFormValues({ ...formValues, budgetPerMember: e });
  };
  const handleActivityPeople = (e: any) => {
    setFormValues({ ...formValues, memberCount: e });
  };
  const handleActivityExtraBudget = (e: any) => {
    setFormValues({ ...formValues, extraBudget: e });
  };
  return (
    <Modal
      opened={opened}
      onClose={close}
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
        <Button type="submit" size="xs" fullWidth mt={"sm"}>
          수정하기
        </Button>
      </Stack>
      {/* </form> */}

      <Group justify="flex-end" mt={"xs"}></Group>
    </Modal>
  );
}

export default ModifyActivityBudget;
