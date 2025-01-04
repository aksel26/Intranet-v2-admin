"use client";

import {
  Button,
  Drawer,
  Group,
  NumberInput,
  Select,
  Stack,
} from "@mantine/core";
import React, { useState } from "react";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { MONTH } from "@/app/enums/month";
import notification from "@/app/utils/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as postApi from "@/app/api/post/postApi";
interface FormValues {
  baseAmount: null | number;
  mealBudget: string | null | number;
  year: string | number;
  month: string | number;
}

function MealBaseAmountDrawer({ opened, close }: any) {
  const queryClient = useQueryClient();
  const [workDay, setWorkDay] = useState<string | number>("");
  const [mealBudget, setMealBudget] = useState<string | number>("");
  const [baseAmount, setBaseAmount] = useState(0);
  const [searchParam, setSearchParam] = useState<{
    month: number;
    year: number;
  }>({
    month: dayjs().month() + 1,
    year: dayjs().year(),
  });
  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      baseAmount: null,
      mealBudget: null,
      year: searchParam.year.toString(),
      month: searchParam.month.toString(),
    },
  });

  const changeMonth = (e: any) =>
    setSearchParam((prev) => ({ ...prev, month: e.replace("월", "") }));

  const { mutate: saveBaseBudget } = useMutation({
    mutationFn: (values: any) => postApi.updateMealBudget(values),
  });
  const saveBaseAmount = () => {
    form.setFieldValue("baseAmount", baseAmount);
    form.setFieldValue("mealBudget", mealBudget);
    form.setFieldValue("year", searchParam.year.toString());
    form.setFieldValue("month", searchParam.month.toString());

    saveBaseBudget(
      { body: form.getValues() },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["mealsBudget"] });
          notification({
            title: "식대 기본 금액 설정",
            color: "green",
            message: "식대 기본 금액이 설정되었습니다.",
          });
          close();
          setWorkDay("");
          setMealBudget("");
          form.reset();
        },
        onError: () => {
          notification({
            title: "식대 기본 금액 설정",
            color: "red",
            message: "식대 기본 금액 설정 요청을 실패하였습니다.",
          });
        },
      }
    );
  };

  const defaultPrice = (e: any) => {
    setMealBudget(() => e * Number(workDay));
    setBaseAmount(e);
  };
  const handleWorkDay = (e: any) => {
    setWorkDay(e);
    setMealBudget(() => e * baseAmount);
  };
  return (
    <Drawer
      offset={8}
      size="md"
      radius="md"
      opened={opened}
      onClose={close}
      title="식대 기본금액 설정"
      position="right"
    >
      <form onSubmit={form.onSubmit(saveBaseAmount)}>
        <Stack gap={"lg"} py={"md"}>
          <Select
            withAsterisk
            allowDeselect={false}
            label="적용 월 선택"
            maxDropdownHeight={200}
            size="sm"
            checkIconPosition="right"
            data={MONTH}
            defaultValue={`${dayjs().month() + 1}월`}
            onChange={changeMonth}
          />

          <NumberInput
            withAsterisk
            description="식대금액이 설정한 기간에 일괄적으로 적용됩니다."
            label="기본 제공 식대"
            placeholder="금액을 입력해 주세요."
            thousandSeparator=","
            hideControls
            suffix=" 원"
            onChange={defaultPrice}
          />

          <NumberInput
            withAsterisk
            label="업무일"
            thousandSeparator=","
            hideControls
            suffix=" 일"
            value={workDay}
            onChange={handleWorkDay}
            placeholder="해당 월의 업무일을 입력해 주세요."
            allowNegative={false}
          />

          <NumberInput
            label={"인원별 총 금액"}
            description="기본제공 식대 x 업무일"
            readOnly
            variant="unstyled"
            thousandSeparator=","
            hideControls
            suffix=" 원"
            value={mealBudget}
            styles={{ root: { fontWeight: 700 } }}
            placeholder="자동계산되어 표시됩니다."
          />
          <Group wrap="nowrap">
            <Button fullWidth type="submit" radius={"md"}>
              저장
            </Button>
            <Button
              fullWidth
              onClick={close}
              radius={"md"}
              variant="light"
              color="gray"
            >
              닫기
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}

export default MealBaseAmountDrawer;
