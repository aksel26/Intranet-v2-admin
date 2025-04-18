"use client";

import { Alert, Button, Divider, Group, Modal, Stack, Text } from "@mantine/core";
import React, { Suspense } from "react";
import IconInfo from "/public/icons/info-circle.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStaff } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
("@/app/api/post/postApi");
function DeleteModal({ opened, close, selectedRow }: any) {
  if (!selectedRow) return;
  const queryClient = useQueryClient();

  const { userName, id, userCell, userEmail } = selectedRow;

  const { mutate } = useMutation({
    mutationFn: (values: any) => deleteStaff(values),
  });

  const deleteConfirm = () => {
    const { userIdx } = selectedRow;
    mutate(
      { userIdx },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["staffs"] });
          close();
          notification({
            color: "green",
            message: "해당 직원정보가 삭제되었습니다.",
            title: "직원 삭제",
          });
        },
        onError: (error: any) => {
          console.log(error);
        },
      }
    );
  };

  return (
    <Modal opened={opened} onClose={close} centered title="직원 삭제">
      <Suspense fallback={<div>Loading...</div>}>
        <Stack>
          <Alert variant="outline" color="red" radius="md" title="해당 직원을 삭제하시겠습니까?" icon={<IconInfo />}>
            <Group mt={"sm"} gap={"xs"}>
              <Text size="xs" c={"gray.7"}>
                {userName}
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                {id}
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                {userCell}
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                {userEmail}
              </Text>
            </Group>
          </Alert>
          <Group wrap="nowrap">
            <Button variant="light" color="red" fullWidth onClick={deleteConfirm}>
              삭제하기
            </Button>
            <Button variant="light" color="gray" fullWidth onClick={close}>
              닫기
            </Button>
          </Group>
        </Stack>
      </Suspense>
    </Modal>
  );
}

export default DeleteModal;
