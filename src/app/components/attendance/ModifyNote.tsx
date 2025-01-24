"use client";

import * as postApi from "@/app/api/post/postApi";
import { dateFormatYYYYMMDD } from "@/app/utils/dateFormat";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

function ModifyNote({ closeModifyNote, openedModifyNote, selectedRows }: any) {
  const queyrClient = useQueryClient();
  const noteRef = useRef<any>();

  const { mutate: resetLunchGroup } = useMutation({
    mutationFn: (values: any) => postApi.modifyNote(values),
  });
  const modifyNote = async (e: any) => {
    if (e.key === "Enter" || e.type === "click") {
      resetLunchGroup(
        { note: noteRef.current.value, commuteIdx: selectedRows.commuteIdx },
        {
          onError: (error) => {
            notification({
              color: "red",
              title: "특이사항 수정",
              message: "특이사항 수정에 실패하였습니다.",
            });
          },
          onSuccess: async (data) => {
            await queyrClient.invalidateQueries({ queryKey: ["attendances"] });
            notification({
              color: "green",
              title: "특이사항 수정",
              message: "특이사항이 수정되었습니다.",
            });

            closeModifyNote();
          },
        }
      );
    }
  };

  return (
    <Modal opened={openedModifyNote} onClose={closeModifyNote} title="특이사항 수정" centered>
      <Stack gap="md">
        <Group gap={"xs"}>
          <Text c={"dimmed"} fz={"sm"}>
            성명
          </Text>
          <Text fw={600} fz={"sm"}>
            {selectedRows?.userName}
          </Text>
        </Group>

        <Group gap={"xs"}>
          <Text c={"dimmed"} fz={"sm"}>
            대상 날짜
          </Text>
          <Text fw={600} fz={"sm"}>
            {dateFormatYYYYMMDD(selectedRows?.checkInTime)}
          </Text>
        </Group>

        <TextInput label="특이사항 입력" placeholder="특이사항 내용을 입력해 주세요." ref={noteRef} onKeyDown={(e) => modifyNote(e)} />
        <Group wrap="nowrap">
          <Button fullWidth size="sm" variant="light" onClick={modifyNote}>
            수정
          </Button>
          <Button fullWidth size="sm" color="gray" onClick={closeModifyNote}>
            닫기
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default ModifyNote;
