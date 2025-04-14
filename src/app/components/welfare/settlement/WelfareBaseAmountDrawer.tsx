"use client";

import * as postApi from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { yearsList } from "@/app/utils/selectTimeList";
import { Button, Drawer, Group, NumberInput, Radio, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
interface FormValues {
  year: string;
  period: string;
  welfareBudget: number | null;
}

function WelfareBaseAmountDrawer({ opened, close }: any) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      year: dayjs().year().toString(),
      period: "H1",
      welfareBudget: null,
    },
  });

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.updateWelfarePointBudget(values),
  });
  const saveWelfareBudget = (values: FormValues) => {
    console.log("🚀 ~ saveWelfareBudget ~ values:", values);
    mutate(values, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["welfareBudget"] });
        notification({
          title: "복지포인트",
          message: "복지포인트 기본금액 설정을 완료하였습니다.",
          color: "green",
        });
        form.reset();
      },
      onError: () => {
        notification({
          title: "복지포인트",
          message: "복지포인트 기본금액 설정을 완료하였습니다.",
          color: "green",
        });
      },
    });
  };

  return (
    <Drawer offset={8} size="md" radius="md" opened={opened} onClose={close} title="복지포인트 기본금액 설정" position="right">
      <form onSubmit={form.onSubmit(saveWelfareBudget)}>
        <Stack gap={30} py={"md"}>
          <Select
            label="연도"
            description="일괄 적용할 연도를 선택해 주세요."
            data={yearsList().map((item) => ({ value: item.toString(), label: `${item}년` }))}
            comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
            key={form.key("year")}
            {...form.getInputProps("year")}
          />

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

          <NumberInput
            withAsterisk
            label="복지포인트 금액"
            description="설정될 복지포인트 기본 금액을 입력해 주세요."
            placeholder="숫자를 입력해 주세요."
            thousandSeparator=","
            hideControls
            suffix=" 원"
            key={form.key("welfareBudget")}
            {...form.getInputProps("welfareBudget")}
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

export default WelfareBaseAmountDrawer;
