"use client";

import { Button, Drawer, Group, NumberInput, Radio, Select, Stack, Text } from "@mantine/core";
import React, { useState } from "react";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { MONTH } from "@/app/enums/month";
import notification from "@/app/utils/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as postApi from "@/app/api/post/postApi";

interface FormValues {
  period: string;
  userIdx: null | number;
  activityBudget: null | number;
  activityPeople: null | number;
}

function SettlementBaseAmountDrawer({ opened, close }: any) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      period: "H1",
      userIdx: null,
      activityBudget: null,
      activityPeople: null,
    },
  });

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.updateWelfarePointBudget(values),
  });
  const submitWelfareBudget = (values: FormValues) => {
    mutate(values, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["activitiesBudget"] });
        notification({ title: "활동비", message: "활동비 기본금액 설정을 완료하였습니다.", color: "green" });
        form.reset();
      },
      onError: () => {
        notification({ title: "활동비", message: "활동비 기본금액 설정을 완료하였습니다.", color: "green" });
      },
    });
  };

  const [calculate, setCalculate] = useState({
    period: "H1",
    userIdx: null,
    activityBudget: null,
    activityPeople: null,
  });
  form.watch("period", (values: any) => {
    setCalculate((prev) => ({ ...prev, period: values.value }));
  });
  form.watch("userIdx", (values: any) => {
    setCalculate((prev) => ({ ...prev, userIdx: values.value }));
  });
  form.watch("activityBudget", (values: any) => {
    setCalculate((prev) => ({ ...prev, activityBudget: values.value }));
  });
  form.watch("activityPeople", (values: any) => {
    setCalculate((prev) => ({ ...prev, activityPeople: values.value }));
  });

  return (
    <Drawer offset={8} size="md" radius="md" opened={opened} onClose={close} title="활동비 기본금액 설정" position="right">
      <form onSubmit={form.onSubmit(submitWelfareBudget)}>
        <Stack gap={"xl"} py={"md"}>
          <Radio.Group
            label="적용 기간 설정"
            description="복지포인트가 설정한 기간에 일괄적으로 적용됩니다."
            withAsterisk
            styles={{ description: { marginBottom: 17 } }}
            key={form.key("period")}
            {...form.getInputProps("period")}
          >
            <Group mt="xs">
              <Radio value="H1" label="상반기" />
              <Radio value="H2" label="하반기" />
            </Group>
          </Radio.Group>

          <Select
            withAsterisk
            label="대상자 선택"
            key={form.key("userIdx")}
            {...form.getInputProps("userIdx")}
            placeholder="활동비를 부여할 인원을 선택해 주세요."
            data={["김현근", "박민수", "김대희", "윤이나"]}
          />

          <NumberInput
            withAsterisk
            label="구성원 당 금액"
            description="설정될 활동비 기본 금액을 입력해 주세요."
            placeholder="숫자를 입력해 주세요."
            thousandSeparator=","
            hideControls
            suffix=" 원"
            key={form.key("activityBudget")}
            {...form.getInputProps("activityBudget")}
          />
          <NumberInput
            withAsterisk
            label="구성원 수"
            description="본부 또는 팀 구성원 수를 입력해 주세요."
            placeholder="숫자로 입력해 주세요."
            thousandSeparator=","
            hideControls
            suffix=" 명"
            key={form.key("activityPeople")}
            {...form.getInputProps("activityPeople")}
          />

          <Stack gap={"xs"}>
            <Text>
              <Text component="span">{calculate.userIdx}</Text>님의{" "}
            </Text>
            <Text>
              <Text component="span">{calculate.period}</Text> 예상 배정금액은 <Text component="span">{calculate.activityBudget}</Text>원 입니다.{" "}
            </Text>
          </Stack>

          <Group wrap="nowrap">
            <Button fullWidth type="submit" radius={"md"}>
              저장
            </Button>
            <Button fullWidth onClick={close} radius={"md"} variant="light" color="gray">
              닫기
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}

export default SettlementBaseAmountDrawer;
