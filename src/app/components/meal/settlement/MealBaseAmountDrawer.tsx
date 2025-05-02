"use client";

import { Button, Drawer, Group, NumberInput, Select, Stack } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";

import notification from "@/app/utils/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as postApi from "@/app/api/post/postApi";
import { getYearRange, monthList } from "@/app/utils/selectTimeList";
interface FormValues {
  year: string | number;
  month: string | number;
}

function MealBaseAmountDrawer({ opened, close }: any) {
  const queryClient = useQueryClient();
  const [workDay, setWorkDay] = useState<string | number>("");
  const [baseAmount, setBaseAmount] = useState<string | number>("");
  const [mealBudget, setMealBudget] = useState<string | number>("");

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      year: dayjs().year().toString(),
      month: (dayjs().month() + 1).toString(),
    },
  });

  const { mutate: saveBaseBudget } = useMutation({
    mutationFn: (values: any) => postApi.updateMealBudget(values),
  });
  const saveBaseAmount = (values: any) => {
    form.setFieldValue("baseAmount", baseAmount);
    form.setFieldValue("workdays", workDay);
    // form.setFieldValue("mealBudget", mealBudget);

    saveBaseBudget(
      { body: form.getValues() },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["mealsSettlement"] });
          notification({
            title: "식대 기본 금액 설정",
            color: "green",
            message: "식대 기본 금액이 설정되었습니다.",
          });
          close();
          setWorkDay("");
          setMealBudget("");
          setBaseAmount("");
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

  const handleWorkingDay = (e: string | number) => {
    setWorkDay(e);
  };
  const handleBaseAmount = (e: string | number) => {
    setBaseAmount(e);
  };

  useEffect(() => {
    const calc = Number(baseAmount) * Number(workDay);
    setMealBudget(calc);
  }, [baseAmount, workDay]);

  return (
    <Drawer offset={8} size="md" radius="md" opened={opened} onClose={close} title="식대 기본금액 설정" position="right">
      <form onSubmit={form.onSubmit(saveBaseAmount)}>
        <Stack gap={"lg"} py={"md"}>
          <Select
            withAsterisk
            allowDeselect={false}
            label="적용 연도 선택"
            maxDropdownHeight={200}
            size="sm"
            data={getYearRange().map((item) => ({ value: item.toString(), label: `${item}년` }))}
            checkIconPosition="right"
            defaultValue={`${dayjs().month() + 1}월`}
            key={form.key("year")}
            {...form.getInputProps("year")}
            // onChange={changeMonth}
          />
          <Select
            withAsterisk
            allowDeselect={false}
            label="적용 월 선택"
            maxDropdownHeight={200}
            size="sm"
            checkIconPosition="right"
            data={monthList().map((item) => ({ value: item.toString(), label: `${item}월` }))}
            key={form.key("month")}
            {...form.getInputProps("month")}
            // onChange={changeMonth}
          />

          <NumberInput
            withAsterisk
            description="식대금액이 설정한 기간에 일괄적으로 적용됩니다."
            label="기본 제공 식대"
            placeholder="금액을 입력해 주세요."
            thousandSeparator=","
            hideControls
            suffix=" 원"
            onChange={handleBaseAmount}
            value={baseAmount}
            // key={form.key("baseAmount")}
            // {...form.getInputProps("baseAmount")}
          />

          <NumberInput
            withAsterisk
            label="업무일"
            thousandSeparator=","
            hideControls
            suffix=" 일"
            value={workDay}
            onChange={handleWorkingDay}
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
            <Button fullWidth onClick={close} radius={"md"} variant="light" color="gray">
              닫기
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}

export default MealBaseAmountDrawer;
