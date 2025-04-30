import * as postApi from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
interface FormValues {
  note?: string;
}
const ModifyNote = ({ opened, close, currentRow }: any) => {
  console.log("🚀 ~ ModifyNote ~ currentRow:", currentRow);
  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      note: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.modifyVacationNote(values),
  });

  useEffect(() => {
    form.setInitialValues({ note: currentRow?.note });
    form.setValues({ note: currentRow?.note });
  }, [currentRow]);

  const submit = (values: any) => {
    mutate(
      { body: values, commuteIdx: currentRow.userIdx },
      {
        onSuccess: () => {
          notification({ color: "green", message: "특이사항 등록이 완료되었습니다.", title: "특이사항 등록" });
          close();
          queryClient.invalidateQueries({ queryKey: ["vacationDetail"] });
          form.reset();
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
          notification({ color: "red", message: errorMessage, title: "특이사항 등록" });
        },
      }
    );
  };

  if (!currentRow) return;
  return (
    <Modal opened={opened} onClose={close} title="특이사항 입력" centered>
      <Group>
        <Stack gap={2}>
          <Text fz={"xs"} c={"dimmed"}>
            성명
          </Text>
          <Text fz={"xs"}>{currentRow.userName}</Text>
        </Stack>
        <Stack gap={2}>
          <Text fz={"xs"} c={"dimmed"}>
            직급
          </Text>
          <Text fz={"xs"}>{currentRow.gradeName}</Text>
        </Stack>
        <Stack gap={2}>
          <Text fz={"xs"} c={"dimmed"}>
            생년월일
          </Text>
          <Text fz={"xs"}>{currentRow.userBirth}</Text>
        </Stack>
        <Stack gap={2}>
          <Text fz={"xs"} c={"dimmed"}>
            이메일
          </Text>
          <Text fz={"xs"}>{currentRow.userEmail}</Text>
        </Stack>
      </Group>
      <form onSubmit={form.onSubmit((values) => submit(values))}>
        <Textarea
          styles={{ label: { fontSize: "var(--mantine-font-size-xs)" } }}
          my={"md"}
          key={form.key("note")}
          {...form.getInputProps("note")}
          label="특이사항 입력"
          placeholder="특이사항 내용을 입력해 주세요."
        />

        <Group wrap="nowrap">
          <Button fullWidth size="sm" type="submit">
            입력
          </Button>
          <Button fullWidth size="sm" color="gray" onClick={close} variant="light">
            닫기
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ModifyNote;
