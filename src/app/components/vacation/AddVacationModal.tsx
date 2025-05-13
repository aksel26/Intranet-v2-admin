import { getStaffs } from "@/app/api/get/getApi";
import { addVacations } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { getYearRange } from "@/app/utils/selectTimeList";
import { Button, Group, Modal, NumberInput, Select, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";

function AddVacationModal({ opened, close }: any) {
  const queryClient = useQueryClient();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      userIdx: null,
      year: dayjs().year().toString(),
      leaveTypeIdx: "12",
      extraLeave: "1",
    },
  });

  const [searchParam, setSearchParam] = useState({
    pageNo: 1,
    perPage: 50,
    userAvail: "Y",
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["staffs", searchParam], queryFn: () => getStaffs(searchParam), enabled: !!opened });

  const staffs = data?.data.data.users.map((item: { userIdx: number; userName: string }) => ({
    value: item.userIdx.toString(),
    label: item.userName,
  }));

  const { mutate } = useMutation({
    mutationFn: (values: any) => addVacations(values),
  });

  const submit = (values: any) => {
    const submitValues = {
      userIdx: Number(values.userIdx),
      year: values.year,
      leaveTypeIdx: Number(values.leaveTypeIdx),
      extraLeave: Number(values.extraLeave),
      note: values.note,
    };

    mutate(submitValues, {
      onSuccess: async () => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey;
            const targetKeys = ["vacations", "addVacationDetails", "vacationStats"];
            return Array.isArray(queryKey) && targetKeys.includes(queryKey[0]);
          },
        });

        notification({ color: "green", message: "휴가/연차 부여가 완료되었습니다.", title: "휴가/연차 부여" });
        close();
      },
      onError: (error: Error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
        notification({ color: "red", message: errorMessage, title: errorMessage });
      },
    });
  };
  return (
    <Modal opened={opened} onClose={close} title="휴가/연차 추가 부여" centered size={"sm"}>
      <form onSubmit={form.onSubmit((values) => submit(values))}>
        <Text c={"dimmed"} fz={"sm"}>
          해마다 부여되는 근속연수에 따른 연차 이외에, <br />
          추가 휴가/연차를 부여할 수 있습니다.
        </Text>
        <Stack my={"lg"}>
          <Select key={form.key("year")} {...form.getInputProps("year")} data={getYearRange().map((year: number) => year.toString())} label="연도 선택" />
          <Select placeholder="대상자를 선택하세요." key={form.key("userIdx")} {...form.getInputProps("userIdx")} data={staffs} label="대상자 선택" />
          <Select
            key={form.key("leaveTypeIdx")}
            {...form.getInputProps("leaveTypeIdx")}
            data={[
              { label: "특별 휴무", value: "7" },
              { label: "대체 휴무", value: "12" },
            ]}
            label="유형 선택"
          />
          <NumberInput
            key={form.key("extraLeave")}
            {...form.getInputProps("extraLeave")}
            suffix="개"
            label="부여 개수 입력"
            placeholder="부여할 휴가 개수를 입력해 주세요."
            min={0}
          />

          <Textarea key={form.key("note")} {...form.getInputProps("note")} label="내용" placeholder="휴가/연차 부여 사유를 입력해 주세요." />
        </Stack>
        <Group wrap="nowrap">
          <Button fullWidth type="submit">
            확인
          </Button>
          <Button fullWidth color="gray" onClick={close}>
            취소
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default AddVacationModal;
