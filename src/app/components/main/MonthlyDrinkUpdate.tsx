import { getStaffs } from "@/app/api/get/getApi";
import { monthlyDrink } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { monthList } from "@/app/utils/selectTimeList";
import { Button, Drawer, Group, Modal, MultiSelect, Select, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCalendar } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";

const MonthlyDrinkUpdate = ({ opened, close }: any) => {
  const [searchParam, setSearchParam] = useState({
    pageNo: 1,
    perPage: 50,
    userAvail: "Y",
  });
  const { data, isLoading, isError } = useQuery({ queryKey: ["staffs", searchParam], queryFn: () => getStaffs(searchParam), enabled: !!opened });
  const staffs = data?.data.data.users.map((item: { userIdx: number; userName: string }) => ({
    value: item.userName,
    label: item.userName,
  }));
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      month: "",
      pickup: [],
      dueDate: null,
    },

    validate: {
      month: (value) => (value.length < 1 ? "적용 월을 선택해 주세요." : null),
      pickup: (value) => (value.length < 1 ? "픽업 인원을 선택해 주세요." : null),
      dueDate: (value) => (!value ? "작성 기한을 설정해 주세요." : null),
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (values: any) => monthlyDrink(values),
  });

  const submit = (values: any) => {
    const submitValues = {
      month: values.month,
      pickup: values.pickup,
      dueDate: dayjs(values.dueDate).format("YYYY-MM-DD"),
    };

    mutate(submitValues, {
      onSuccess: async () => {
        notification({ color: "green", message: "신청 내용 설정이 완료되었습니다.", title: "신청 내용 설정" });
        await queryClient.invalidateQueries({ queryKey: ["monthlyDrink"] });
        close();
        form.reset();
      },
      onError: (error: Error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
        notification({ color: "red", message: errorMessage, title: "신청 내용 설정" });
      },
    });
  };

  return (
    <Modal opened={opened} onClose={close} title="신청 내용 설정">
      <form onSubmit={form.onSubmit(submit)}>
        <Stack gap={"sm"}>
          <Select
            withAsterisk
            key={form.key("month")}
            {...form.getInputProps("month")}
            label="월 선택"
            size="sm"
            data={monthList().map((item) => ({ value: item.toString(), label: `${item}월` }))}
            placeholder="적용 월을 선택해 주세요."
            styles={{ label: { color: "var(--mantine-color-gray-5)" } }}
          />
          <MultiSelect
            searchable
            withAsterisk
            key={form.key("pickup")}
            {...form.getInputProps("pickup")}
            label="픽업 인원 선택"
            data={staffs}
            size="sm"
            placeholder="픽업 인원을 선택해 주세요."
            styles={{ label: { color: "var(--mantine-color-gray-5)" } }}
          />
          <DatePickerInput
            valueFormat="YYYY-MM-DD"
            highlightToday
            withAsterisk
            firstDayOfWeek={0}
            locale="ko"
            key={form.key("dueDate")}
            {...form.getInputProps("dueDate")}
            leftSection={<IconCalendar size={16} strokeWidth={1.2} />}
            label="기한 선택"
            placeholder="작성 기한을 설정해 주세요."
            styles={{ label: { color: "var(--mantine-color-gray-5)" } }}
          />
        </Stack>

        <Group wrap="nowrap" mt="md">
          <Button variant="light" fullWidth data-autofocus type="submit">
            저장하기
          </Button>
          <Button variant="light" color="gray" fullWidth onClick={close}>
            닫기
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default MonthlyDrinkUpdate;
