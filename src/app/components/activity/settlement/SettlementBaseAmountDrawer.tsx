"use client";

import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Button, Drawer, Group, NumberInput, Radio, Select, Stack } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import SettlementBaseAmountSummary from "./template/SettlementBaseAmountSummary";
import { getYearRange } from "@/app/utils/selectTimeList";
import dayjs from "dayjs";
import { AxiosError } from "axios";

interface FormValues {
  period: string;
  budgetPerMember: null | number;
  memberCount: null | number;
  activityBudget: null | undefined;
}

function SettlementBaseAmountDrawer({ opened, close }: any) {
  const queryClient = useQueryClient();

  const [formValues, setFormValues] = useState({
    year: dayjs().year().toString(),
    period: "H1",
    budgetPerMember: undefined,
    memberCount: undefined,
    activityBudget: 0,
  });

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.updateActivitiesPointBudget(values),
  });

  const handleYear = (e: any) => {
    setFormValues({ ...formValues, year: e });
  };

  const handlePeriod = (e: any) => {
    setFormValues({ ...formValues, period: e });
  };

  const handleActivityBudget = (e: any) => {
    setFormValues({ ...formValues, budgetPerMember: e });
  };
  const handleActivityPeople = (e: any) => {
    setFormValues({ ...formValues, memberCount: e });
  };

  useEffect(() => {
    const activityBudget: number | undefined = Number(formValues.budgetPerMember || 0) * Number(formValues.memberCount || 0);
    setFormValues({ ...formValues, activityBudget: activityBudget });
  }, [formValues.budgetPerMember, formValues.memberCount]);

  const submitActivityBudget = () => {
    mutate(formValues, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["settlementActivities"] });
        notification({ title: "활동비", message: "활동비 기본금액 설정을 완료하였습니다.", color: "green" });
        // form.reset();
        close();
      },

      onError: (error: Error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
        notification({ color: "red", message: errorMessage, title: "활동비 설정" });
      },
    });
  };

  return (
    <Drawer offset={8} size="md" radius="md" opened={opened} onClose={close} title="활동비 기본금액 설정" position="right">
      {/* <form onSubmit={form.onSubmit(submitActivityBudget)}> */}
      <Stack gap={"xl"} py={"md"}>
        <Select
          withAsterisk
          allowDeselect={false}
          label="적용 연도 선택"
          maxDropdownHeight={200}
          size="sm"
          data={getYearRange().map((item) => ({ value: item.toString(), label: `${item}년` }))}
          checkIconPosition="right"
          onChange={handleYear}
          value={formValues.year}
        />
        <Radio.Group
          label="적용 기간 설정"
          description="복지포인트가 설정한 기간에 일괄적으로 적용됩니다."
          withAsterisk
          styles={{ description: { marginBottom: 17 } }}
          value={formValues.period}
          onChange={handlePeriod}
        >
          <Group mt="xs">
            <Radio value="H1" label="상반기" />
            <Radio value="H2" label="하반기" />
          </Group>
        </Radio.Group>

        <NumberInput
          withAsterisk
          label="구성원 당 금액"
          description="설정될 활동비 기본 금액을 입력해 주세요."
          placeholder="숫자를 입력해 주세요."
          thousandSeparator=","
          hideControls
          suffix=" 원"
          value={formValues.budgetPerMember}
          onChange={handleActivityBudget}
        />
        <NumberInput
          withAsterisk
          label="구성원 수"
          description="본부 또는 팀 구성원 수를 입력해 주세요."
          placeholder="숫자로 입력해 주세요."
          thousandSeparator=","
          hideControls
          suffix=" 명"
          value={formValues.memberCount}
          onChange={handleActivityPeople}
        />

        <SettlementBaseAmountSummary formValues={formValues} />

        <Group wrap="nowrap">
          <Button fullWidth onClick={submitActivityBudget} radius={"md"}>
            저장
          </Button>
          <Button fullWidth onClick={close} radius={"md"} variant="light" color="gray">
            닫기
          </Button>
        </Group>
      </Stack>
      {/* </form> */}
    </Drawer>
  );
}

export default SettlementBaseAmountDrawer;
