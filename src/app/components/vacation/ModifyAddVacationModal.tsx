import { modifyVacationGrant } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { getYearRange } from "@/app/utils/selectTimeList";
import { Button, Group, Modal, Select, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";

function ModifyAddVacationModal({ opened, close, details }: any) {
  if (!details) return null;
  const { userName, extraLeave, note, year, userIdx, leaveTypeIdx, leaveExtraIdx } = details;
  const queryClient = useQueryClient();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      userIdx: userIdx.toString(),
      year: year,
      leaveTypeIdx: leaveTypeIdx.toString(),
      extraLeave: extraLeave.toString(),
      note: note,
    },
  });

  const { mutate } = useMutation({
    mutationFn: (values: any) => modifyVacationGrant(values),
  });

  const submit = (values: any) => {
    const submitValues = {
      userIdx: Number(values.userIdx),
      year: values.year,
      leaveTypeIdx: Number(values.leaveTypeIdx),
      extraLeave: Number(values.extraLeave),
      note: values.note,
    };

    mutate(
      { body: submitValues, queryParams: leaveExtraIdx },
      {
        onSuccess: async () => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey;
              const targetKeys = ["vacations", "addVacationDetails", "vacationStats"];
              return Array.isArray(queryKey) && targetKeys.includes(queryKey[0]);
            },
          });

          notification({ color: "green", message: "휴가/연차 부여내역 수정이 완료되었습니다.", title: "휴가/연차 부여 내역 수정" });
          close();
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
          notification({ color: "red", message: errorMessage, title: errorMessage });
        },
      }
    );
  };

  useEffect(() => {
    const init = {
      userIdx: userIdx.toString(),
      year: year,
      leaveTypeIdx: leaveTypeIdx.toString(),
      extraLeave: extraLeave.toString(),
      note: note,
    };

    form.setInitialValues(init);
    form.setValues(init);
  }, [details]);
  return (
    <Modal opened={opened} onClose={close} title="휴가/연차 추가 부여" centered size={"sm"}>
      <form onSubmit={form.onSubmit((values) => submit(values))}>
        <Text c={"dimmed"} fz={"sm"}>
          해마다 부여되는 근속연수에 따른 연차 이외에, <br />
          추가 휴가/연차를 부여할 수 있습니다.
        </Text>
        <Stack my={"lg"}>
          <Stack gap={1}>
            <Text c={"dimmed"} fz={"sm"}>
              대상자
            </Text>
            <Text fz={"sm"}>{userName}</Text>
          </Stack>

          <Select key={form.key("year")} {...form.getInputProps("year")} data={getYearRange().map((year: number) => year.toString())} label="연도 선택" />
          <Select
            key={form.key("leaveTypeIdx")}
            {...form.getInputProps("leaveTypeIdx")}
            data={[
              { label: "특별 휴무", value: "7" },
              { label: "대체 휴무", value: "12" },
            ]}
            label="유형 선택"
          />
          <Select
            key={form.key("extraLeave")}
            {...form.getInputProps("extraLeave")}
            data={[
              { label: "0.25개", value: "0.25" },
              { label: "0.5개", value: "0.5" },
              { label: "1개", value: "1" },
            ]}
            label="부여 개수 선택"
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

export default ModifyAddVacationModal;
