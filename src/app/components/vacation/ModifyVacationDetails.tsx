import { Button, Group, Modal, Textarea } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as postApi from "@/app/api/post/postApi";
import { useRef } from "react";
import notification from "@/app/utils/notification";
import { AxiosError } from "axios";
function ModifyVacationDetails({ opened, close, currentRow }: any) {
  console.log("🚀 ~ ModifyVacationDetails ~ currentRow:", currentRow);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.modifyVacationNote(values),
  });

  const noteRef = useRef<any>();

  const submit = () => {
    mutate(
      { body: noteRef?.current?.value, leaveStatsIdx: currentRow.commuteIdx },
      {
        onSuccess: () => {
          notification({ color: "green", message: "특이사항 등록이 완료되었습니다.", title: "특이사항 등록" });
          close();
          queryClient.invalidateQueries({ queryKey: ["vacationDetail"] });
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "오류가 발생했습니다.";
          notification({ color: "red", message: errorMessage, title: "특이사항 등록" });
        },
      }
    );
  };
  return (
    <Modal opened={opened} onClose={close} title="휴가/연차 내용 수정하기" centered>
      <Textarea
        ref={noteRef}
        styles={{ label: { marginBottom: 4 } }}
        label="내용 입력(특이사항)"
        placeholder="휴가 수정 사유 등 특이사항을 입력해 주세요."
        mt={"xs"}
        mb={"lg"}
        autosize
        minRows={3}
        maxRows={4}
      />

      <Group wrap="nowrap">
        <Button fullWidth onClick={submit}>
          수정
        </Button>
        <Button fullWidth color="gray" onClick={close}>
          취소
        </Button>
      </Group>
    </Modal>
  );
}

export default ModifyVacationDetails;
