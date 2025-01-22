"use client";

import { Button, Drawer, Group, NumberInput, Radio, Select, Stack, Text, TextInput } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import * as api from "@/app/api/get/getApi";
import notification from "@/app/utils/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as postApi from "@/app/api/post/postApi";
import SettlementBaseAmountSummary from "./template/SettlementBaseAmountSummary";

interface FormValues {
  period: string;
  userIdx: null | number;
  budgetPerMember: null | number;
  memberCount: null | number;
  activityBudget: null | undefined;
}

function SettlementBaseAmountDrawer({ opened, close }: any) {
  const queryClient = useQueryClient();

  // const form = useForm<FormValues>({
  //   mode: "uncontrolled",
  //   initialValues: {
  //     period: "H1",
  //     userIdx: null,
  //     budgetPerMember: null,
  //     memberCount: null,
  //   },
  // });

  const { data, isLoading, isError } = useQuery({ queryKey: ["users"], queryFn: () => api.getUsers() });
  console.log("🚀 ~ SettlementBaseAmountDrawer ~ data:", data);

  const [formValues, setFormValues] = useState({
    period: "H1",
    user: { label: "", value: "" },
    budgetPerMember: undefined,
    memberCount: undefined,
    activityBudget: 0,
  });
  const [users, setUsers] = useState([]);
  console.log("🚀 ~ SettlementBaseAmountDrawer ~ formValues:", formValues);

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.updateWelfarePointBudget(values),
  });

  const handlePeriod = (e: any) => {
    setFormValues({ ...formValues, period: e });
  };

  const handleUser = (e: any, data: any) => {
    setFormValues({ ...formValues, user: data });
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

  useEffect(() => {
    setUsers(
      data?.data.data
        .filter((user: any) => user.gradeIdx <= 3)
        .map((user: any) => ({
          label: user.userName,
          value: user.userIdx.toString(),
        }))
    );
  }, [data]);

  const submitActivityBudget = () => {
    console.log("🚀 ~ submitActivityBudget ~ formValues:", formValues);
    // mutate(values, {
    //   onSuccess: async () => {
    //     await queryClient.invalidateQueries({ queryKey: ["activitiesBudget"] });
    //     notification({ title: "활동비", message: "활동비 기본금액 설정을 완료하였습니다.", color: "green" });
    //     // form.reset();
    //   },
    //   onError: () => {
    //     notification({ title: "활동비", message: "활동비 기본금액 설정을 완료하였습니다.", color: "green" });
    //   },
    // });
  };

  return (
    <Drawer offset={8} size="md" radius="md" opened={opened} onClose={close} title="활동비 기본금액 설정" position="right">
      {/* <form onSubmit={form.onSubmit(submitActivityBudget)}> */}
      <Stack gap={"xl"} py={"md"}>
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

        <Select
          withAsterisk
          value={formValues.user.value}
          onChange={handleUser}
          label="대상자 선택"
          placeholder="활동비를 부여할 인원을 선택해 주세요."
          data={users}
        />

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

          // onChange={(e) => calculateForm(e, "budgetPerMember")}
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
          // onChange={(e) => calculateForm(e, "activityPeople")}
        />

        {/* <Stack gap={"xs"}>
            <Text component="span">{calculate.userIdx}</Text>님의
            <Text component="span">{calculate.period}</Text> 예상 배정금액은
            <Group>
              <NumberInput variant="unstyled" placeholder="Input placeholder" suffix="원" onChange={setBudgetTotal} thousandSeparator="," value={budgetTotal} />
              <Text> 입니다.</Text>
            </Group>
          </Stack> */}

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
