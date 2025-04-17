"use client";

import * as postApi from "@/app/api/post/postApi";
import { dateFormatYYYYMMDD } from "@/app/utils/dateFormat";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

function ModifyNote({ closeModifyNote, openedModifyNote, selectedRows }: any) {
  const queyrClient = useQueryClient();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      note: "",
      earlyLeaveReason: "",
      updateReason: "",
    },
  });

  useEffect(() => {
    form.setInitialValues({ note: selectedRows?.note, earlyLeaveReason: selectedRows?.earlyLeaveReason, updateReason: selectedRows?.updateReason });
    form.setValues({ note: selectedRows?.note, earlyLeaveReason: selectedRows?.earlyLeaveReason, updateReason: selectedRows?.updateReason });
  }, [selectedRows]);

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.modifyNote(values),
  });

  const modifyNote = async (value: any) => {
    console.log("🚀 ~ modifyNote ~ value:", value);
    mutate(
      { body: value, commuteIdx: selectedRows.commuteIdx },
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
          form.reset();
        },
      }
    );
  };

  return (
    <Modal opened={openedModifyNote} onClose={closeModifyNote} title="특이사항 수정" centered>
      <Stack gap="md">
        <form onSubmit={form.onSubmit((values) => modifyNote(values))}>
          <Stack gap={3} mb={"md"}>
            <Group gap={"xs"}>
              <Text c={"dimmed"} fz={"sm"} w={60}>
                성명
              </Text>
              <Text fw={500} fz={"sm"}>
                {selectedRows?.userName}
              </Text>
            </Group>

            <Group gap={"xs"}>
              <Text c={"dimmed"} fz={"sm"} w={60}>
                대상 날짜
              </Text>
              <Text fw={500} fz={"sm"}>
                {dateFormatYYYYMMDD(selectedRows?.checkInTime)}
              </Text>
            </Group>
          </Stack>

          <Stack gap={"md"} mb={"md"}>
            <TextInput key={form.key("note")} {...form.getInputProps("note")} label="특이사항 입력" placeholder="특이사항 내용을 입력해 주세요." />
            <TextInput
              key={form.key("updateReason")}
              {...form.getInputProps("updateReason")}
              label="근태 수정 사유 입력"
              placeholder="근태 수정 사유를 입력해 주세요."
            />
            <TextInput
              key={form.key("earlyLeaveReason")}
              {...form.getInputProps("earlyLeaveReason")}
              label="조기퇴근 사유 입력"
              placeholder="조기퇴근 사유를 입력해 주세요."
            />
          </Stack>

          <Group wrap="nowrap">
            <Button fullWidth size="sm" type="submit">
              수정
            </Button>
            <Button fullWidth size="sm" color="gray" onClick={closeModifyNote} variant="light">
              닫기
            </Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
}

export default ModifyNote;
