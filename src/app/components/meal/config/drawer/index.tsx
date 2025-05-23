import { Button, Drawer, NumberInput, Stack, Textarea, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as postApi from "@/app/api/post/postApi";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import notification from "@/app/utils/notification";
import { AxiosError } from "axios";

interface TLunchGroupDrawer {
  opened: boolean;
  details: any;
  close: () => void;
}

const LunchGroupDrawer = ({ opened, close, details }: TLunchGroupDrawer) => {
  const queyrClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.setLunchGroup(values),
  });
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      total: null,
      perGroup: null,
      date: [!details?.sDate ? null : dayjs(details?.sDate).toDate(), !details?.sDate ? null : dayjs(details?.eDate).toDate()],
      notice: "",
    },
  });

  const submit = (values: any) => {
    const temp = { ...values };
    temp.sDate = dayjs(temp.date[0]).format("YYYY-MM-DD");
    temp.eDate = dayjs(temp.date[1]).format("YYYY-MM-DD");
    delete temp.date;
    mutate(temp, {
      onSuccess: async () => {
        await queyrClient.invalidateQueries({ queryKey: ["lunchGroup"] });
        notification({
          color: "green",
          message: "점심조 뽑기 설정이 완료되었습니다.",
          title: "점심조 뽑기 설정",
        });
        form.reset();
        close();
        // setLunchGroupDate([null, null]);
      },
      onError: (error: Error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
        notification({
          color: "red",
          message: errorMessage,
          title: "점심조 뽑기 설정",
        });
      },
    });
  };

  const closeDrawer = () => {
    close();
  };

  useEffect(() => {
    if (details) {
      form.setValues({
        total: details.total,
        perGroup: details.perGroup,
        date: [dayjs(details.sDate).toDate(), dayjs(details.eDate).toDate()],
        notice: details.notice,
      });
    }
  }, [details]);

  return (
    <Drawer offset={8} size="md" radius="md" opened={opened} onClose={closeDrawer} title="점심조 설정" position="right">
      <form onSubmit={form.onSubmit(submit)}>
        <Stack>
          <NumberInput
            key={form.key("total")}
            {...form.getInputProps("total")}
            hideControls
            label="총원"
            description="점심조 참여 총 인원을 입력해 주세요."
            placeholder="점심조 참여인원"
          />
          <NumberInput
            key={form.key("perGroup")}
            {...form.getInputProps("perGroup")}
            hideControls
            label="조별 인원"
            description="한 조에 들어갈 인원을 입력해 주세요."
            placeholder="조 인원 수"
          />

          <DatePickerInput
            valueFormat="MM월 D일 dddd"
            firstDayOfWeek={0}
            allowSingleDateInRange
            locale="ko"
            type="range"
            clearable
            highlightToday
            label="점심조 기간"
            placeholder="점심조 기간 설정"
            key={form.key("date")}
            {...form.getInputProps("date")}
          />
          <Textarea
            autosize
            minRows={4}
            label="월/금 점심조"
            placeholder="월/금 점심조를 입력해 주세요."
            key={form.key("notice")}
            {...form.getInputProps("notice")}
          />
          <Button type="submit">저장</Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default LunchGroupDrawer;
