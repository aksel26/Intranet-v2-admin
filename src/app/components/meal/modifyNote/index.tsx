"use client";

import * as postApi from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

function ModifyNote({ closeModifyNote, openedModifyNote, selectedRows }: any) {
  console.log("🚀 ~ ModifyNote ~ selectedRows:", selectedRows);
  const queyrClient = useQueryClient();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      note: "",
    },
  });

  useEffect(() => {
    form.setInitialValues({ note: selectedRows?.note });
    form.setValues({ note: selectedRows?.note });
  }, [selectedRows]);

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.mealNote(values),
  });

  const modifyNote = async (value: any) => {
    mutate(
      { body: value, mealIdx: selectedRows.mealIdx },
      {
        onError: (error) => {
          notification({
            color: "red",
            title: "비고 수정",
            message: "비고 수정에 실패하였습니다.",
          });
        },
        onSuccess: async (data) => {
          await queyrClient.invalidateQueries({ queryKey: ["meals"] });
          notification({
            color: "green",
            title: "비고 수정",
            message: "특이사항이 수정되었습니다.",
          });
          closeModifyNote();
          form.reset();
        },
      }
    );
  };

  return (
    <Modal opened={openedModifyNote} onClose={closeModifyNote} title="비고 수정" centered>
      <Stack gap="md">
        <form onSubmit={form.onSubmit((values) => modifyNote(values))}>
          <Stack gap={2} mb={"md"}>
            <Text c={"dimmed"} fz={"sm"} w={60}>
              성명
            </Text>
            <Text fw={500} fz={"sm"}>
              {selectedRows?.userName}
            </Text>
          </Stack>

          <TextInput mb={"lg"} key={form.key("note")} {...form.getInputProps("note")} label="비고 입력" placeholder="비고 내용을 입력해 주세요." />

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
